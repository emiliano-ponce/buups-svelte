import { getDb } from '$lib/server/db'
import { user } from '$lib/server/db/schema'
import { syncSheetToDB } from '$lib/server/sheets-sync'
import { error, fail, redirect } from '@sveltejs/kit'
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
            email: true,
        },
        with: {
            reviews: true,
        },
    })

    if (!userWithRelations) {
        throw error(404, 'User not found')
    }

    return {
        accountUser: userWithRelations,
    }
}

export const actions = {
    syncSheetToDB: async ({ locals }) => {
        if (!locals.user) {
            return fail(403, { message: 'Unauthorized' })
        }

        const db = getDb()
        try {
            const stats = await syncSheetToDB(db)
            return {
                success: true,
                stats,
                message: `Sync complete: ${stats.synced} synced, ${stats.skipped} skipped, ${stats.errors} errors`,
            }
        } catch (error) {
            console.error('Sync failed:', error)
            return fail(500, {
                message: error instanceof Error ? error.message : 'Sync failed',
            })
        }
    },
}
