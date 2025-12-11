import { getDb } from '$lib/server/db'
import { media, review, user, type Media, type Review, type User } from '$lib/server/db/schema'
import { json } from '@sveltejs/kit'
import { and, desc, eq, gte, sql, type SQL } from 'drizzle-orm'
import { lte } from 'drizzle-orm/mysql-core/expressions'

const MEDIA_PER_PAGE = 10

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

    // Build the review score condition SQL for the subquery
    let scoreConditionSql1 = sql``
    let scoreConditionSql2 = sql``
    if (scoreFilter) {
        const scoreValue = parseInt(scoreFilter)
        if (scoreFilter === '1') {
            scoreConditionSql1 = sql`AND r1.score <= ${scoreValue}`
            scoreConditionSql2 = sql`AND r3.score <= ${scoreValue}`
        } else if (scoreFilter === '10') {
            scoreConditionSql1 = sql`AND r1.score >= ${scoreValue}`
            scoreConditionSql2 = sql`AND r3.score >= ${scoreValue}`
        } else {
            scoreConditionSql1 = sql`AND r1.score = ${scoreValue}`
            scoreConditionSql2 = sql`AND r3.score = ${scoreValue}`
        }
    }

    // Add condition to filter media with reviews from both users
    // and if scoreFilter is set, at least one review must meet the score condition
    mediaConditions.push(sql`${media.id} IN (
        SELECT r1.media_id
        FROM ${review} r1
        INNER JOIN ${user} u1 ON r1.author_id = u1.id
        WHERE u1.username = 'Emiliano'
        ${scoreConditionSql1}
        AND EXISTS (
            SELECT 1
            FROM ${review} r2
            INNER JOIN ${user} u2 ON r2.author_id = u2.id
            WHERE r2.media_id = r1.media_id
            AND u2.username = 'jars'
        )
        UNION
        SELECT r3.media_id
        FROM ${review} r3
        INNER JOIN ${user} u3 ON r3.author_id = u3.id
        WHERE u3.username = 'jars'
        ${scoreConditionSql2}
        AND EXISTS (
            SELECT 1
            FROM ${review} r4
            INNER JOIN ${user} u4 ON r4.author_id = u4.id
            WHERE r4.media_id = r3.media_id
            AND u4.username = 'Emiliano'
        )
    )`)

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
