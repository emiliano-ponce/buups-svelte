// Pure helpers for computing review statistics on the series page.
// Averaging rules:
//  - A person's score for a piece of media is the mean of their reviews of it (handles duplicates).
//  - A media item's overall score is the mean of the per-person scores of everyone who rated it.
//  - Aggregates (series, season, movies) are the mean over rated media items.

export const REVIEWERS = {
    emiliano: 'Emiliano',
    jars: 'jars',
} as const

export interface StatsReview {
    author: string
    score: number
}

export interface StatsMedia {
    id: number
    title: string
    type: 'movie' | 'episode' | 'special'
    seasonNumber: number | null
    episode: number
    reviews: StatsReview[]
}

export interface MediaScores {
    emiliano: number | null
    jars: number | null
    overall: number | null
}

export interface AggregateScores extends MediaScores {
    total: number
    rated: number
}

export function mean(values: number[]): number | null {
    if (values.length === 0) return null
    return values.reduce((a, b) => a + b, 0) / values.length
}

function personScore(reviews: StatsReview[], username: string): number | null {
    return mean(reviews.filter(r => r.author === username).map(r => r.score))
}

export function getMediaScores(item: Pick<StatsMedia, 'reviews'>): MediaScores {
    const emiliano = personScore(item.reviews, REVIEWERS.emiliano)
    const jars = personScore(item.reviews, REVIEWERS.jars)
    const overall = mean([emiliano, jars].filter((v): v is number => v !== null))
    return { emiliano, jars, overall }
}

export function aggregateScores(items: Pick<StatsMedia, 'reviews'>[]): AggregateScores {
    const scores = items.map(getMediaScores)
    const pick = (k: keyof MediaScores) => mean(scores.map(s => s[k]).filter((v): v is number => v !== null))
    return {
        emiliano: pick('emiliano'),
        jars: pick('jars'),
        overall: pick('overall'),
        total: items.length,
        rated: scores.filter(s => s.overall !== null).length,
    }
}

export interface ScoredMedia<T extends StatsMedia = StatsMedia> {
    media: T
    scores: MediaScores
}

export function scoreAll<T extends StatsMedia>(items: T[]): ScoredMedia<T>[] {
    return items.map(media => ({ media, scores: getMediaScores(media) }))
}

const byEpisodeOrder = (a: StatsMedia, b: StatsMedia) =>
    (a.seasonNumber ?? 0) - (b.seasonNumber ?? 0) || a.episode - b.episode

export function topRated<T extends StatsMedia>(items: T[], n = 5): ScoredMedia<T>[] {
    return scoreAll(items)
        .filter(s => s.scores.overall !== null)
        .sort((a, b) => b.scores.overall! - a.scores.overall! || byEpisodeOrder(a.media, b.media))
        .slice(0, n)
}

export function bottomRated<T extends StatsMedia>(items: T[], n = 5): ScoredMedia<T>[] {
    return scoreAll(items)
        .filter(s => s.scores.overall !== null)
        .sort((a, b) => a.scores.overall! - b.scores.overall! || byEpisodeOrder(a.media, b.media))
        .slice(0, n)
}

/** Media both reviewers rated, sorted by the absolute difference of their scores (largest first). */
export function biggestDisagreements<T extends StatsMedia>(items: T[], n = 5): (ScoredMedia<T> & { diff: number })[] {
    return scoreAll(items)
        .filter(s => s.scores.emiliano !== null && s.scores.jars !== null)
        .map(s => ({ ...s, diff: Math.abs(s.scores.emiliano! - s.scores.jars!) }))
        .filter(s => s.diff > 0)
        .sort((a, b) => b.diff - a.diff || byEpisodeOrder(a.media, b.media))
        .slice(0, n)
}

/** Format a score for display: one decimal place, or 'N/A' when there is no data. */
export function formatScore(value: number | null | undefined, digits = 1): string {
    if (value === null || value === undefined || Number.isNaN(value)) return 'N/A'
    return value.toFixed(digits)
}
