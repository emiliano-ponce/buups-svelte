import { getDb } from '$lib/server/db'
import { user } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ locals }) {
    if (!locals.user) {
        redirect(303, '/login')
    }

    const db = getDb()
    const userWithRelations = await db.query.user.findFirst({
        where: eq(user.id, locals.user.id),
        columns: {
            username: true,
            email: true
        },
        with: {
            reviews: true,
        }
    })

    if (!userWithRelations) {
        throw error(404, 'User not found')
    }

    return {
        accountUser: userWithRelations,
    }
}
