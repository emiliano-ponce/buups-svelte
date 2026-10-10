import { getDb } from '$lib/server/db'
import { media, season } from '$lib/server/db/schema'
import { findSeriesOr404 } from '$lib/server/seriesLookup'
import { refreshSeriesIfStale } from '$lib/server/tmdbRefresh'
import { getAdjacent, parseRouteInt } from '$lib/utils/mediaRoutes'
import { getMediaScores } from '$lib/utils/seriesStats'
import { error, redirect } from '@sveltejs/kit'
import { and, asc, eq, ne } from 'drizzle-orm'
import type { GroupedReviews, MediaWithRelations } from '../../../../../../api/reviews/+server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login')
    const db = getDb()

    const record = await findSeriesOr404(params.acronym)
    const seasonNumber = parseRouteInt(params.season)
    const episodeNumber = parseRouteInt(params.episode)
    if (seasonNumber === null || episodeNumber === null) throw error(404, 'Episode not found')

    const seasonRecord = await db.query.season.findFirst({
        where: and(eq(season.seriesId, record.id), eq(season.number, seasonNumber)),
    })
    if (!seasonRecord) throw error(404, `${record.acronym} has no season ${seasonNumber}`)

    const episode = await db.query.media.findFirst({
        where: and(eq(media.seasonId, seasonRecord.id), eq(media.episode, episodeNumber), ne(media.type, 'movie')),
        with: { reviews: { with: { author: { columns: { username: true } } } } },
    })
    if (!episode) throw error(404, `${record.acronym} S${seasonNumber} has no episode ${episodeNumber}`)

    refreshSeriesIfStale(record)

    // Prev/next across the whole series, ordered by season then episode.
    const ordered = await db
        .select({ id: media.id, title: media.title, episode: media.episode, season: season.number })
        .from(media)
        .innerJoin(season, eq(media.seasonId, season.id))
        .where(and(eq(media.seriesId, record.id), ne(media.type, 'movie')))
        .orderBy(asc(season.number), asc(media.episode))
    const { prev, next } = getAdjacent(ordered, m => m.id === episode.id)

    const reviews: GroupedReviews = episode.reviews.length
        ? [
              {
                  media: {
                      ...episode,
                      series: { acronym: record.acronym },
                      season: { number: seasonNumber },
                  } as unknown as MediaWithRelations,
                  reviews: episode.reviews
                      .sort((a, b) => b.createDt.getTime() - a.createDt.getTime())
                      .map(r => ({ ...r, author: r.author.username })),
              },
          ]
        : []

    return {
        series: { id: record.id, title: record.title, acronym: record.acronym },
        season: { id: seasonRecord.id, number: seasonRecord.number, title: seasonRecord.title },
        episode: {
            id: episode.id,
            title: episode.title,
            number: episode.episode,
            date: episode.date,
            overview: episode.overview,
            imageUrl: episode.imageUrl,
            tmdb: episode.tmdbStats,
        },
        scores: getMediaScores({ reviews: episode.reviews.map(r => ({ author: r.author.username, score: r.score })) }),
        reviewCount: episode.reviews.length,
        prev,
        next,
        reviews,
    }
}
