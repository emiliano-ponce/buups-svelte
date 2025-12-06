import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth'
import { getDb } from '$lib/server/db'
import { user } from '$lib/server/db/schema'
import { verifyPasswordHash } from '$lib/server/password'
import { fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Actions } from './$types'

export const actions: Actions = {
    default: async event => {
        const db = getDb()
        const data = await event.request.formData()
        const username = data.get('username')
        const password = data.get('password')

        if (!username || !password) {
            return fail(400, { error: 'Username and password are required' })
        }

        // Find user
        const [existingUser] = await db
            .select()
            .from(user)
            .where(eq(user.username, username as string))

        if (!existingUser) {
            return fail(400, { error: 'Invalid username or password' })
        }

        // Verify password
        const validPassword = await verifyPasswordHash(existingUser.passwordHash, password as string)

        if (!validPassword) {
            return fail(400, { error: 'Invalid username or password' })
        }

        // Create session
        const token = generateSessionToken()
        const session = await createSession(token, existingUser.id)
        setSessionTokenCookie(event, token, session.expiresAt)

        redirect(303, '/')
    },
}
