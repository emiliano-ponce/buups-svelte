import { env } from '$env/dynamic/private'
import { getDb } from '$lib/server/db'
import { passwordResetToken, user } from '$lib/server/db/schema'
import { createId } from '@paralleldrive/cuid2'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import type { Actions } from './$types'

const resend = new Resend(env.EMAIL_API_KEY)

async function sendPasswordResetEmail(email: string, token: string, username: string) {
    const resetLink = `${env.PUBLIC_SITE_URL}/reset-password?token=${token}`

    await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h2>Password Reset</h2>
            <p>Hi ${username},</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link expires in 1 hour.</p>
        `,
    })
}

export const actions: Actions = {
    default: async ({ request }) => {
        const db = getDb()
        const data = await request.formData()
        const email = data.get('email')

        if (!email) {
            return fail(400, { error: 'Email is required' })
        }

        const [existingUser] = await db
            .select()
            .from(user)
            .where(eq(user.email, email as string))

        if (!existingUser) {
            return { success: 'If an account exists with that email, a password reset link has been sent.' }
        }

        await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, existingUser.id))

        const token = createId()
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await db.insert(passwordResetToken).values({
            userId: existingUser.id,
            token,
            expiresAt,
        })

        try {
            await sendPasswordResetEmail(existingUser.email, token, existingUser.username)
        } catch (error) {
            console.error('Failed to send password reset email:', error)
        }

        return { success: 'If an account exists with that email, a password reset link has been sent.' }
    },
}
