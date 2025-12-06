import { getDb } from '$lib/server/db'
import { media, review, type Media, type Review, type User } from '$lib/server/db/schema'
import { json } from '@sveltejs/kit'
import { and, desc, eq, gte, SQL, sql } from 'drizzle-orm'
import { lte } from 'drizzle-orm/mysql-core/expressions'

const REVIEWS_PER_PAGE = 10

export async function GET({ locals, url }) {
    const db = getDb()
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const seriesFilter = url.searchParams.get('series') ?? ''
    const seasonFilter = url.searchParams.get('season') ?? ''
    const scoreFilter = url.searchParams.get('score') ?? ''
    const titleSearch = url.searchParams.get('title') ?? ''
    const page = parseInt(url.searchParams.get('page') ?? '1')

    const mediaConditions: SQL<unknown>[] = []

    if (seriesFilter) {
        mediaConditions.push(eq(media.seriesId, parseInt(seriesFilter)))
    }

    if (seasonFilter === 'movie') {
        mediaConditions.push(eq(media.type, 'movie'))
    } else if (seasonFilter && seriesFilter) {
        mediaConditions.push(eq(media.seasonId, parseInt(seasonFilter)))
    }

    if (titleSearch && titleSearch.trim()) {
        mediaConditions.push(sql`${media.title} LIKE ${`%${titleSearch.trim()}%`}`)
    }

    const reviewConditions: SQL<unknown>[] = []

    if (scoreFilter) {
        let compareFn = eq
        if (scoreFilter === '1') {
            compareFn = lte
        } else if (scoreFilter === '10') {
            compareFn = gte
        }

        const subqueryConditions: SQL<unknown>[] = [compareFn(review.score, parseInt(scoreFilter))]

        reviewConditions.push(sql`${review.mediaId} IN (
            SELECT DISTINCT ${review.mediaId}
            FROM ${review}
            WHERE ${and(...subqueryConditions)}
        )`)
    }

    const conditions = [...mediaConditions, ...reviewConditions]

    const offset = (page - 1) * REVIEWS_PER_PAGE

    const reviewsWithMedia = await db.query.review.findMany({
        with: {
            media: {
                with: {
                    series: {
                        columns: { acronym: true },
                    },
                    season: {
                        columns: { number: true },
                    },
                },
            },
            author: {
                columns: { username: true },
            },
        },
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(review.createDt), desc(review.mediaId)],
        limit: REVIEWS_PER_PAGE + 1,
        offset: offset,
    })

    const hasMore = reviewsWithMedia.length > REVIEWS_PER_PAGE

    const groupedReviews: GroupedReviews = Array.from(
        reviewsWithMedia
            .reduce((map, result) => {
                const { media, author, ...review } = result

                const existing = map.get(media.id)
                if (existing) {
                    existing.reviews.push({
                        ...review,
                        author: author.username,
                    })
                } else {
                    map.set(media.id, {
                        media: media,
                        reviews: [
                            {
                                ...review,
                                author: author.username,
                            },
                        ],
                    })
                }

                return map
            }, new Map<number, GroupedReviews[number]>())
            .values()
    )

    return json({
        reviews: groupedReviews,
        hasMore,
        currentPage: page,
    })
}

export type GetReviewsResponse = {
    reviews: GroupedReviews
    hasMore: boolean
    currentPage: number
}

export type MediaWithRelations = Media & {
    series: { acronym: string }
    season: { number: number } | null
}

export type DisplayReview = Review & { author: User['username'] }

export type GroupedReviews = {
    media: MediaWithRelations
    reviews: Array<DisplayReview>
}[]
