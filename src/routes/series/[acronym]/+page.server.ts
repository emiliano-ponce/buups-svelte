import { getDb } from '$lib/server/db'
import { media, series } from '$lib/server/db/schema'
import { getSeriesList } from '$lib/server/seriesSummaries'
import { refreshSeriesIfStale } from '$lib/server/tmdbRefresh'
import {
    aggregateScores,
    biggestDisagreements,
    bottomRated,
    getMediaScores,
    topRated,
    type StatsMedia,
} from '$lib/utils/seriesStats'
import { error, redirect } from '@sveltejs/kit'
import { asc, eq, sql } from 'drizzle-orm'
import type { GroupedReviews, MediaWithRelations } from '../../api/reviews/+server'
import type { PageServerLoad } from './$types'

const RECENT_REVIEW_MEDIA = 5

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login')
    const db = getDb()

    const acronym = params.acronym.trim()
    const record = await db.query.series.findFirst({
        where: sql`upper(${series.acronym}) = upper(${acronym})`,
    })
    if (!record) throw error(404, `No series found for "${acronym}"`)

    // Stale-while-revalidate: serve stored TMDB data now, refresh in the background.
    refreshSeriesIfStale(record)

    const [seriesList, seasons, mediaRows] = await Promise.all([
        getSeriesList(),
        db.query.season.findMany({
            where: (s, { eq }) => eq(s.seriesId, record.id),
            orderBy: (s, { asc }) => [asc(s.number)],
        }),
        db.query.media.findMany({
            where: eq(media.seriesId, record.id),
            with: {
                season: { columns: { number: true } },
                reviews: { with: { author: { columns: { username: true } } } },
            },
            orderBy: [asc(media.date), asc(media.episode)],
        }),
    ])

    type Item = StatsMedia & { date: string; imageUrl: string | null; tmdbAvg: number | null; seasonId: number | null }
    const toItem = (m: (typeof mediaRows)[number]): Item => ({
        id: m.id,
        title: m.title,
        type: m.type,
        seasonId: m.seasonId,
        seasonNumber: m.season?.number ?? null,
        episode: m.episode,
        date: m.date,
        imageUrl: m.imageUrl,
        tmdbAvg: m.tmdbStats?.voteAvg ?? null,
        reviews: m.reviews.map(r => ({ author: r.author.username, score: r.score })),
    })

    // Movies are shown separately and excluded from series averages; specials count.
    const items = mediaRows.map(toItem)
    const episodes = items.filter(i => i.type !== 'movie')
    const movies = items.filter(i => i.type === 'movie').sort((a, b) => a.episode - b.episode)

    const seasonRows = seasons.map(s => ({
        id: s.id,
        number: s.number,
        title: s.title,
        tmdbAvg: s.tmdbStats?.voteAvg ?? null,
        ...aggregateScores(episodes.filter(e => e.seasonId === s.id)),
    }))

    // Recent reviews: media in this series ordered by their latest review.
    const latest = (m: (typeof mediaRows)[number]) => Math.max(0, ...m.reviews.map(r => r.createDt.getTime()))
    const recentReviews: GroupedReviews = mediaRows
        .filter(m => m.reviews.length > 0)
        .sort((a, b) => latest(b) - latest(a))
        .slice(0, RECENT_REVIEW_MEDIA)
        .map(m => ({
            media: { ...m, series: { acronym: record.acronym }, season: m.season } as unknown as MediaWithRelations,
            reviews: m.reviews.map(r => ({ ...r, author: r.author.username })),
        }))

    return {
        series: {
            id: record.id,
            title: record.title,
            acronym: record.acronym,
            overview: record.overview,
            imageUrl: record.imageUrl,
            tmdb: record.tmdbStats,
        },
        seriesList,
        totals: aggregateScores(episodes),
        seasons: seasonRows,
        movies: movies.map(m => ({ ...m, scores: getMediaScores(m) })),
        top: topRated(episodes),
        bottom: bottomRated(episodes),
        disagreements: biggestDisagreements(episodes),
        recentReviews,
    }
}
