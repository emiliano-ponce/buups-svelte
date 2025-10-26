import { db } from '$lib/server/db'
import { media } from '$lib/server/db/schema'
import { error, json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
    const mediaId = parseInt(params.id)

    if (isNaN(mediaId)) {
        throw error(400, 'Invalid media ID')
    }

    const mediaItem = await db.query.media.findFirst({
        where: eq(media.id, mediaId),
    })

    if (!mediaItem) {
        throw error(404, 'Media not found')
    }

    return json(mediaItem)
}
