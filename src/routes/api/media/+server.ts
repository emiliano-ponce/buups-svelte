// src/routes/api/seasons/+server.ts
import { getDb } from '$lib/server/db'
import { media } from '$lib/server/db/schema'
import { json } from '@sveltejs/kit'
import { and, asc, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
    const db = getDb()
    const seriesId = url.searchParams.get('seriesId')
    const seasonId = url.searchParams.get('seasonId')

    if (!seriesId || !seasonId) {
        return json([])
    }

    const medias = await db
        .select()
        .from(media)
        .where(and(eq(media.seriesId, parseInt(seriesId)), eq(media.seasonId, parseInt(seasonId))))
        .orderBy(asc(media.episode))

    return json(medias)
}
