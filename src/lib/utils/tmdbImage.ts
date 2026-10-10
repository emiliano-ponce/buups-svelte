/** Swap a stored TMDB "original" image URL for a smaller size (e.g. w185, w342). */
export function tmdbImageSize(url: string | null | undefined, size: string): string | undefined {
    if (!url) return undefined
    return url.replace('/t/p/original/', `/t/p/${size}/`)
}
