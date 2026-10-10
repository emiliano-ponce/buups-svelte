// Route builders matching the hrefs produced by mediaLinks.ts.

export const seriesHref = (acronym: string) => `/series/${acronym}`
export const seasonHref = (acronym: string, season: number) => `/series/${acronym}/season/${season}`
export const episodeHref = (acronym: string, season: number, episode: number) =>
    `/series/${acronym}/season/${season}/episode/${episode}`

/** Parse a route segment as a non-negative integer (TOS's pilot is episode 0). Returns null if invalid. */
export function parseRouteInt(value: string): number | null {
    if (!/^\d{1,4}$/.test(value)) return null
    return Number(value)
}

/** Previous/next neighbours of the item matching `isCurrent` in an already-ordered list. */
export function getAdjacent<T>(items: T[], isCurrent: (item: T) => boolean): { prev: T | null; next: T | null } {
    const i = items.findIndex(isCurrent)
    if (i === -1) return { prev: null, next: null }
    return { prev: items[i - 1] ?? null, next: items[i + 1] ?? null }
}
