// page.server.ts
import { db } from '$lib/server/db'

export async function load() {
    const reviews = await db.query.review.findMany({
        with: {
            author: true,
            media: {
                with: {
                    series: true,
                    season: true,
                },
            },
        },
        orderBy: (reviews, { desc }) => [desc(reviews.createDt)],
    })

    const groupedReviews = reviews.reduce<Map<string, typeof reviews>>((acc, review) => {
        const { media } = review
        const { title } = media
        if (!acc.has(title)) {
            acc.set(title, [])
        }
        acc.get(title)!.push(review)
        return acc
    }, new Map())

    const orderedGroups = Array.from(groupedReviews.entries()).map(([title, reviews]) => ({
        title,
        reviews,
    }))

    return { reviews: orderedGroups }
}

export type PageData = Awaited<ReturnType<typeof load>>
export type GroupedReviews = PageData['reviews']
export type ReviewWithRelations = GroupedReviews[number]['reviews'][number]
