import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth'
import { getDb } from '$lib/server/db'
import { user } from '$lib/server/db/schema'
import { hashPassword, verifyPasswordHash } from '$lib/server/password'
import { fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
    const userId = cookies.get('pending_password_change')

    if (!userId) {
        redirect(303, '/login')
    }

    return {}
}

export const actions: Actions = {
    default: async event => {
        const userId = event.cookies.get('pending_password_change')

        if (!userId) {
            redirect(303, '/login')
        }

        const db = getDb()
        const data = await event.request.formData()
        const currentPassword = data.get('currentPassword')
        const newPassword = data.get('newPassword')
        const confirmPassword = data.get('confirmPassword')

        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, { error: 'All fields are required' })
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { error: 'New passwords do not match' })
        }

        if ((newPassword as string).length < 8) {
            return fail(400, { error: 'Password must be at least 8 characters' })
        }

        if (currentPassword === newPassword) {
            return fail(400, { error: 'New password must be different from current password' })
        }

        const [existingUser] = await db.select().from(user).where(eq(user.id, userId))

        if (!existingUser) {
            return fail(400, { error: 'User not found' })
        }

        const validPassword = await verifyPasswordHash(existingUser.passwordHash, currentPassword as string)

        if (!validPassword) {
            return fail(400, { error: 'Current password is incorrect' })
        }

        const newPasswordHash = await hashPassword(newPassword as string)

        await db
            .update(user)
            .set({
                passwordHash: newPasswordHash,
                requirePasswordChange: false,
            })
            .where(eq(user.id, userId))

        event.cookies.delete('pending_password_change', { path: '/' })

        const token = generateSessionToken()
        const session = await createSession(token, existingUser.id)
        setSessionTokenCookie(event, token, session.expiresAt)

        redirect(303, '/')
    },
}
