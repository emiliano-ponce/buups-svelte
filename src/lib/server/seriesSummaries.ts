import { getDb } from '$lib/server/db'
import { media, series } from '$lib/server/db/schema'
import { aggregateScores } from '$lib/utils/seriesStats'
import { asc, ne } from 'drizzle-orm'

/** Series in release order (ids follow the acronym enum, which is chronological). */
export async function getSeriesList() {
    return getDb()
        .select({ id: series.id, acronym: series.acronym, title: series.title, imageUrl: series.imageUrl })
        .from(series)
        .orderBy(asc(series.id))
}

/** Per-series summary for the /series index. Movies are excluded from averages. */
export async function getSeriesSummaries() {
    const db = getDb()
    const [allSeries, mediaRows] = await Promise.all([
        db.query.series.findMany({ orderBy: [asc(series.id)] }),
        db.query.media.findMany({
            where: ne(media.type, 'movie'),
            columns: { id: true, seriesId: true },
            with: { reviews: { columns: { score: true }, with: { author: { columns: { username: true } } } } },
        }),
    ])
    return allSeries.map(s => {
        const items = mediaRows
            .filter(m => m.seriesId === s.id)
            .map(m => ({ reviews: m.reviews.map(r => ({ author: r.author.username, score: r.score })) }))
        return {
            id: s.id,
            acronym: s.acronym,
            title: s.title,
            overview: s.overview,
            imageUrl: s.imageUrl,
            tmdb: s.tmdbStats,
            scores: aggregateScores(items),
        }
    })
}
