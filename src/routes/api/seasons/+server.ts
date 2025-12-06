// src/routes/api/seasons/+server.ts
import { getDb } from '$lib/server/db'
import { season } from '$lib/server/db/schema'
import { json } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
    const db = getDb()
    const seriesId = url.searchParams.get('seriesId')

    if (!seriesId) {
        return json([])
    }

    const seasons = await db
        .select()
        .from(season)
        .where(eq(season.seriesId, parseInt(seriesId)))
        .orderBy(asc(season.number))

    return json(seasons)
}
