import { getDb } from '$lib/server/db'
import { media, season } from '$lib/server/db/schema'
import { findSeriesOr404 } from '$lib/server/seriesLookup'
import { refreshSeriesIfStale } from '$lib/server/tmdbRefresh'
import { parseRouteInt } from '$lib/utils/mediaRoutes'
import { aggregateScores, biggestDisagreements, bottomRated, getMediaScores, topRated } from '$lib/utils/seriesStats'
import { error, redirect } from '@sveltejs/kit'
import { and, asc, eq } from 'drizzle-orm'
import type { GroupedReviews, MediaWithRelations } from '../../../../api/reviews/+server'
import type { PageServerLoad } from './$types'

const RECENT_REVIEW_MEDIA = 5

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login')
    const db = getDb()

    const record = await findSeriesOr404(params.acronym)
    const seasonNumber = parseRouteInt(params.season)
    if (seasonNumber === null) throw error(404, `Season "${params.season}" not found`)

    const seasons = await db
        .select({ id: season.id, number: season.number, title: season.title })
        .from(season)
        .where(eq(season.seriesId, record.id))
        .orderBy(asc(season.number))
    const current = seasons.find(s => s.number === seasonNumber)
    if (!current) throw error(404, `${record.acronym} has no season ${seasonNumber}`)

    // Season TMDB stats are refreshed together with the series.
    refreshSeriesIfStale(record)

    const [seasonRecord, mediaRows] = await Promise.all([
        db.query.season.findFirst({ where: eq(season.id, current.id) }),
        db.query.media.findMany({
            where: and(eq(media.seriesId, record.id), eq(media.seasonId, current.id)),
            with: { reviews: { with: { author: { columns: { username: true } } } } },
            orderBy: [asc(media.episode)],
        }),
    ])
    if (!seasonRecord) throw error(404, 'Season not found')

    const episodes = mediaRows.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        seasonNumber,
        episode: m.episode,
        date: m.date,
        tmdbAvg: m.tmdbStats?.voteAvg ?? null,
        reviews: m.reviews.map(r => ({ author: r.author.username, score: r.score })),
    }))

    const latest = (m: (typeof mediaRows)[number]) => Math.max(0, ...m.reviews.map(r => r.createDt.getTime()))
    const recentReviews: GroupedReviews = mediaRows
        .filter(m => m.reviews.length > 0)
        .sort((a, b) => latest(b) - latest(a))
        .slice(0, RECENT_REVIEW_MEDIA)
        .map(m => ({
            media: {
                ...m,
                series: { acronym: record.acronym },
                season: { number: seasonNumber },
            } as unknown as MediaWithRelations,
            reviews: m.reviews.map(r => ({ ...r, author: r.author.username })),
        }))

    return {
        series: { id: record.id, title: record.title, acronym: record.acronym },
        season: {
            id: seasonRecord.id,
            number: seasonRecord.number,
            title: seasonRecord.title,
            overview: seasonRecord.overview,
            imageUrl: seasonRecord.imageUrl,
            tmdb: seasonRecord.tmdbStats,
        },
        seasons,
        totals: aggregateScores(episodes),
        episodes: episodes.map(e => ({ ...e, scores: getMediaScores(e) })),
        top: topRated(episodes, 3),
        bottom: bottomRated(episodes, 3),
        disagreements: biggestDisagreements(episodes, 3),
        recentReviews,
    }
}
