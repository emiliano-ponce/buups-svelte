import { db } from '$lib/server/db'
import { media, review, season, series, user } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { and, desc, eq, gte, SQL, sql } from 'drizzle-orm'
import { lte } from 'drizzle-orm/mysql-core/expressions'

export async function load({ locals, url, parent }) {
    if (!locals.user) {
        throw redirect(303, '/login')
    }

    const seriesFilter = url.searchParams.get('series') ?? ''
    const seasonFilter = url.searchParams.get('season') ?? ''
    const scoreFilter = url.searchParams.get('score') ?? ''
    const titleSearch = url.searchParams.get('title') ?? ''

    const conditions: SQL<unknown>[] = []

    if (seriesFilter) {
        conditions.push(eq(media.seriesId, parseInt(seriesFilter)))
    }

    if (seasonFilter === 'movie') {
        conditions.push(eq(media.type, 'movie'))
    } else if (seasonFilter && seriesFilter) {
        conditions.push(eq(media.seasonId, parseInt(seasonFilter)))
    }

    if (titleSearch && titleSearch.trim()) {
        conditions.push(sql`${media.title} LIKE ${`%${titleSearch.trim()}%`}`)
    }

    let mediaIdSubquery: SQL<unknown> | undefined

    if (scoreFilter) {
        let compareFn = eq
        if (scoreFilter === '1') {
            compareFn = lte
        } else if (scoreFilter === '10') {
            compareFn = gte
        }

        const subqueryConditions: SQL<unknown>[] = [compareFn(review.score, parseInt(scoreFilter))]

        mediaIdSubquery = sql`${review.mediaId} IN (
            SELECT DISTINCT ${review.mediaId}
            FROM ${review}
            WHERE ${and(...subqueryConditions)}
        )`
    }

    if (mediaIdSubquery) {
        conditions.push(mediaIdSubquery)
    }

    const reviewResults = await db
        .select({
            review: review,
            author: user,
            media: media,
        })
        .from(review)
        .innerJoin(user, eq(review.authorId, user.id))
        .innerJoin(media, eq(review.mediaId, media.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(review.createDt), desc(media.id))

    const reviews = await Promise.all(
        reviewResults.map(async row => {
            const [mediaSeries, mediaSeason] = await Promise.all([
                db.query.series.findFirst({
                    where: eq(series.id, row.media.seriesId),
                }),
                row.media.seasonId
                    ? db.query.season.findFirst({
                          where: eq(season.id, row.media.seasonId),
                      })
                    : null,
            ])

            return {
                ...row.review,
                author: row.author,
                media: {
                    ...row.media,
                    series: mediaSeries!,
                    season: mediaSeason,
                },
            }
        })
    )

    const groupedReviews = reviews.reduce<Map<number, typeof reviews>>((acc, review) => {
        const mediaId = review.media.id
        if (!acc.has(mediaId)) {
            acc.set(mediaId, [])
        }
        acc.get(mediaId)!.push(review)
        return acc
    }, new Map())

    const orderedGroups = Array.from(groupedReviews.entries()).map(([mediaId, reviews]) => ({
        mediaId,
        title: reviews[0].media.title,
        reviews,
    }))

    return {
        reviews: orderedGroups,
        filters: {
            series: seriesFilter,
            season: seasonFilter,
            score: scoreFilter,
            title: titleSearch,
        },
    }
}

export type PageData = Awaited<ReturnType<typeof load>>
export type GroupedReviews = PageData['reviews']
export type ReviewWithRelations = GroupedReviews[number]['reviews'][number]
