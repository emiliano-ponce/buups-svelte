import { db } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'

export async function load({ locals, url }) {
    if (!locals.user) {
        throw redirect(303, '/login')
    }

    const seriesFilter = url.searchParams.get('series') ?? ''
    const seasonFilter = url.searchParams.get('season') ?? ''
    const scoreFilter = url.searchParams.get('score') ?? ''
    const titleSearch = url.searchParams.get('title') ?? ''

    // Fetch all series for the filter dropdown
    const allSeries = await db.query.series.findMany()

    return {
        user: locals.user,
        allSeries,
        filters: {
            series: seriesFilter,
            season: seasonFilter,
            score: scoreFilter,
            title: titleSearch,
        },
    }
}

export type PageData = Awaited<ReturnType<typeof load>>
