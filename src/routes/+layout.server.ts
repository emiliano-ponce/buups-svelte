// +layout.server.ts
import { db } from '$lib/server/db'
import { media, review, season, series, type Media } from '$lib/server/db/schema'
import { and, asc, desc, eq, SQL } from 'drizzle-orm'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return {
            user: null,
            session: locals.session,
            nextMedia: null,
            allSeries: [],
        }
    }

    // Only fetch series list - let MediaFilters handle seasons/media
    const allSeries = await db.select().from(series).orderBy(asc(series.id))

    const latestReview = await db.query.review.findFirst({
        where: eq(review.authorId, locals.user.id),
        orderBy: [desc(review.createDt), desc(media.id)],
    })

    let nextMedia: Media | undefined

    if (latestReview) {
        const lastReviewed = await db.query.media.findFirst({
            where: eq(media.id, latestReview.mediaId),
            with: { season: true },
        })

        if (lastReviewed) {
            const conditions: SQL<unknown>[] = [
                eq(media.seriesId, lastReviewed.seriesId),
                eq(media.episode, lastReviewed.episode + 1),
            ]
            if (lastReviewed.seasonId) {
                conditions.push(eq(media.seasonId, lastReviewed.seasonId))
            }

            nextMedia = await db.query.media.findFirst({ where: and(...conditions) })

            if (lastReviewed.season && !nextMedia) {
                const nextSeasonNumber = lastReviewed.season.number + 1
                const nextSeason = await db.query.season.findFirst({
                    where: and(eq(season.seriesId, lastReviewed.seriesId), eq(season.number, nextSeasonNumber)),
                })

                if (nextSeason) {
                    nextMedia = await db.query.media.findFirst({
                        where: and(
                            eq(media.seriesId, lastReviewed.seriesId),
                            eq(media.seasonId, nextSeason.id),
                            eq(media.episode, 1)
                        ),
                    })
                }
            }
        }
    }

    return {
        user: locals.user,
        session: locals.session,
        nextMedia: nextMedia ?? null,
        allSeries,
    }
}
