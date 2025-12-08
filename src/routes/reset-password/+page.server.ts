import { getDb } from '$lib/server/db'
import { passwordResetToken, user } from '$lib/server/db/schema'
import { hashPassword } from '$lib/server/password'
import { fail } from '@sveltejs/kit'
import { and, eq, gt } from 'drizzle-orm'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
    const token = url.searchParams.get('token')

    if (!token) {
        return { validToken: false }
    }

    const db = getDb()

    const [resetToken] = await db
        .select()
        .from(passwordResetToken)
        .where(and(eq(passwordResetToken.token, token), gt(passwordResetToken.expiresAt, new Date())))

    return { validToken: !!resetToken }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const db = getDb()
        const data = await request.formData()
        const token = data.get('token')
        const newPassword = data.get('newPassword')
        const confirmPassword = data.get('confirmPassword')

        if (!token || !newPassword || !confirmPassword) {
            return fail(400, { error: 'All fields are required' })
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match' })
        }

        if ((newPassword as string).length < 8) {
            return fail(400, { error: 'Password must be at least 8 characters' })
        }

        const [resetToken] = await db
            .select()
            .from(passwordResetToken)
            .where(and(eq(passwordResetToken.token, token as string), gt(passwordResetToken.expiresAt, new Date())))

        if (!resetToken) {
            return fail(400, { error: 'Invalid or expired reset token' })
        }

        const newPasswordHash = await hashPassword(newPassword as string)

        await db
            .update(user)
            .set({
                passwordHash: newPasswordHash,
                requirePasswordChange: false,
            })
            .where(eq(user.id, resetToken.userId))

        await db.delete(passwordResetToken).where(eq(passwordResetToken.id, resetToken.id))

        return { success: 'Password reset successfully! You can now log in with your new password.' }
    },
}
