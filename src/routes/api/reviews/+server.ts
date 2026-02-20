import { getDb } from '$lib/server/db'
import { media, review, type Media, type Review, type User } from '$lib/server/db/schema'
import { json } from '@sveltejs/kit'
import { and, desc, eq, gte, sql, type SQL } from 'drizzle-orm'
import { lte } from 'drizzle-orm/mysql-core/expressions'
import type { RequestHandler } from './$types'

const MEDIA_PER_PAGE = 10

export const GET: RequestHandler = async ({ locals, url }) => {
    const db = getDb()
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = locals.user.username === 'Emiliano' || locals.user.username === 'jars'
    // locals.user.isAdmin
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

    // Build the review score condition SQL for the subquery
    let scoreConditionSql1 = sql``
    if (scoreFilter) {
        const scoreValue = parseInt(scoreFilter)
        if (scoreFilter === '1') {
            scoreConditionSql1 = sql`AND r1.score <= ${scoreValue}`
        } else if (scoreFilter === '10') {
            scoreConditionSql1 = sql`AND r1.score >= ${scoreValue}`
        } else {
            scoreConditionSql1 = sql`AND r1.score = ${scoreValue}`
        }
    }

    // Add condition to filter media with at least 1 review
    // If scoreFilter is set, at least one review must meet the score condition
    if (scoreFilter) {
        mediaConditions.push(sql`${media.id} IN (
            SELECT r1.media_id
            FROM ${review} r1
            WHERE 1=1
            ${scoreConditionSql1}
        )`)
    } else {
        mediaConditions.push(sql`${media.id} IN (
            SELECT DISTINCT media_id
            FROM ${review}
        )`)
    }

    const reviewConditions: SQL<unknown>[] = []

    if (scoreFilter) {
        let compareFn = eq
        if (scoreFilter === '1') {
            compareFn = lte
        } else if (scoreFilter === '10') {
            compareFn = gte
        }

        reviewConditions.push(compareFn(review.score, parseInt(scoreFilter)))
    }

    const offset = (page - 1) * MEDIA_PER_PAGE

    const mediaWithReviews = await db.query.media.findMany({
        with: {
            reviews: {
                with: {
                    author: {
                        columns: { username: true },
                    },
                },
                where: reviewConditions.length > 0 ? and(...reviewConditions) : undefined,
            },
            series: {
                columns: { acronym: true },
            },
            season: {
                columns: { number: true },
            },
        },
        where: mediaConditions.length > 0 ? and(...mediaConditions) : undefined,
        orderBy: [desc(media.id)],
        limit: MEDIA_PER_PAGE + 1,
        offset: offset,
    })

    const hasMore = mediaWithReviews.length > MEDIA_PER_PAGE
    const paginatedMedia = hasMore ? mediaWithReviews.slice(0, MEDIA_PER_PAGE) : mediaWithReviews

    const groupedReviews: GroupedReviews = paginatedMedia.map(mediaItem => ({
        media: {
            ...mediaItem,
            series: mediaItem.series,
            season: mediaItem.season,
        } as MediaWithRelations,
        reviews: mediaItem.reviews.map(rev => ({
            ...rev,
            author: rev.author.username,
            // Hide jars's review body for non-admin users
            body: !isAdmin && rev.author.username === 'jars' ? '' : rev.body,
        })),
    }))

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
    season: { number: true } | null
}

export type DisplayReview = Omit<Review, 'author'> & { author: User['username'] }

export type GroupedReviews = {
    media: MediaWithRelations
    reviews: Array<DisplayReview>
}[]
