import { getDb } from '$lib/server/db'
import { series } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { sql } from 'drizzle-orm'

/** Case-insensitive acronym lookup; throws a 404 if no series matches. */
export async function findSeriesOr404(acronym: string) {
    const a = acronym.trim()
    const record = await getDb().query.series.findFirst({
        where: sql`upper(${series.acronym}) = upper(${a})`,
    })
    if (!record) throw error(404, `No series found for "${a}"`)
    return record
}
