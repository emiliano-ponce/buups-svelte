import { getDb } from '$lib/server/db'
import { review } from '$lib/server/db/schema'
import { json } from '@sveltejs/kit'
import { and, desc, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, params, locals }) => {
    const db = getDb()
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mediaId = parseInt(params.id)
    if (isNaN(mediaId)) {
        return json({ error: 'Invalid media ID' }, { status: 400 })
    }
    
    const authorId = url.searchParams.get('authorId') ?? locals.user.id

    if (!mediaId || !authorId) {
        return json([])
    }

    try {
        const reviews = await db.query.review.findMany({
            where: and(eq(review.mediaId, mediaId), eq(review.authorId, authorId)),
            orderBy: [desc(review.createDt), desc(review.mediaId)],
        })

        return json(reviews)
    } catch (error) {
        console.error('Failed to fetch reviews:', error)
        return json([])
    }
}
