import type { MediaWithRelations } from "../../routes/reviews/+server"

export function getMediaLink(media: MediaWithRelations): string {
    const { type, series, season, episode } = media

    if (type === 'movie' || type === 'special') {
        return `/series/${series.acronym}/movie/${media.title}`
    }

    if (type === 'episode' && season) {
        return `/series/${series.acronym}/season/${season.number}/episode/${episode}`
    }

    // Fallback
    return `/media/${media.id}`
}

export function getMediaBreadcrumbs(media: MediaWithRelations) {
    const { type, series, season, episode } = media

    const crumbs = [{ label: series.acronym as string, href: `/series/${series.acronym}` }]

    if (type === 'episode' && season) {
        crumbs.push({ label: `S${season.number}`, href: `/series/${series.acronym}/season/${season.number}` })
        crumbs.push({ label: `EP${episode}`, href: `/series/${series.acronym}/season/${season.number}/episode/${episode}` })
    }

    if (type === 'movie' || type === 'special') {
        crumbs.push({ label: `Movie ${episode}`, href: `/series/${series.acronym}/movies/${media.title}` })
    }

    return crumbs
}
