import { env } from '$env/dynamic/private'
import { getDb } from '$lib/server/db'
import { season, series, type Series } from '$lib/server/db/schema'
import { TMDBIds } from '$lib/utils/tmdbData'
import { and, eq } from 'drizzle-orm'

const DEFAULT_TTL_HOURS = 24
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

interface TMDBTvDetails {
    name: string
    overview: string
    poster_path: string | null
    vote_average: number
    vote_count: number
    seasons?: { season_number: number; vote_average: number }[]
}

// In-flight refreshes keyed by series id, so concurrent requests share one fetch.
const inFlight = new Map<number, Promise<void>>()

export function getTtlMs(): number {
    const hours = Number(env.TMDB_REFRESH_TTL_HOURS)
    return (Number.isFinite(hours) && hours >= 0 ? hours : DEFAULT_TTL_HOURS) * 60 * 60 * 1000
}

export function isStale(updatedAt: Date | null, now = Date.now(), ttlMs = getTtlMs()): boolean {
    return !updatedAt || now - updatedAt.getTime() >= ttlMs
}

async function refreshSeries(record: Series): Promise<void> {
    const apiKey = env.TMDB_API_KEY
    if (!apiKey) {
        console.warn('[tmdb] TMDB_API_KEY not set, skipping refresh')
        return
    }
    const tmdbId = TMDBIds[record.acronym as TrekSeries]?.seriesId
    if (!tmdbId) return

    const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${encodeURIComponent(apiKey)}`)
    if (!res.ok) throw new Error(`TMDB responded ${res.status} for series ${record.acronym}`)
    const data = (await res.json()) as TMDBTvDetails

    const db = getDb()
    const update: Partial<Series> = {
        tmdbStats: { voteAvg: data.vote_average, voteCount: data.vote_count },
        tmdbUpdatedAt: new Date(),
    }
    if (data.overview && data.overview !== record.overview) update.overview = data.overview
    if (data.poster_path) {
        const imageUrl = `${TMDB_IMAGE_BASE}${data.poster_path}`
        if (imageUrl !== record.imageUrl) update.imageUrl = imageUrl
    }
    await db.update(series).set(update).where(eq(series.id, record.id))

    const existingSeasons = await db.select().from(season).where(eq(season.seriesId, record.id))
    for (const tmdbSeason of data.seasons ?? []) {
        const match = existingSeasons.find(s => s.number === tmdbSeason.season_number)
        if (!match || match.tmdbStats?.voteAvg === tmdbSeason.vote_average) continue
        await db
            .update(season)
            .set({ tmdbStats: { ...match.tmdbStats, voteAvg: tmdbSeason.vote_average } })
            .where(and(eq(season.id, match.id), eq(season.seriesId, record.id)))
    }
    console.info(`[tmdb] refreshed ${record.acronym}`)
}

/**
 * Stale-while-revalidate: if the series' TMDB data is stale, kick off a background refresh
 * (deduped per series) and return immediately. Failures are logged, never thrown.
 */
export function refreshSeriesIfStale(record: Series): Promise<void> | null {
    if (!isStale(record.tmdbUpdatedAt ?? null)) return null
    const existing = inFlight.get(record.id)
    if (existing) return existing
    const job = refreshSeries(record)
        .catch(err => console.error(`[tmdb] refresh failed for ${record.acronym}:`, err?.message ?? err))
        .finally(() => inFlight.delete(record.id))
    inFlight.set(record.id, job)
    return job
}
