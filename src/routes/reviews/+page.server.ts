import { getDb } from '$lib/server/db'
import { review } from '$lib/server/db/schema'
import { clearReviewFromSheet, syncReviewToSheet } from '$lib/server/sheets-sync'
import { fail, isRedirect, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Actions } from './$types'

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const db = getDb()
        const data = await request.formData()
        const body = data.get('body')
        const score = data.get('score')
        const mediaId = data.get('mediaId')

        if (!locals.user) return fail(401, { error: 'Unauthorized' })
        const authorId = locals.user.id

        // Validation
        if (!body || typeof body !== 'string' || body.trim().length === 0) {
            return fail(400, { error: 'Review body is required' })
        }

        if (!score || typeof score !== 'string') {
            return fail(400, { error: 'Score is required' })
        }

        const scoreNum = parseInt(score, 10)
        if (isNaN(scoreNum)) {
            return fail(400, { error: 'Score must be a number' })
        }

        if (!authorId || typeof authorId !== 'string') {
            return fail(400, { error: 'Author ID is required' })
        }

        if (!mediaId || typeof mediaId !== 'string') {
            return fail(400, { error: 'Media ID is required' })
        }

        const mediaIdNum = parseInt(mediaId, 10)
        if (isNaN(mediaIdNum)) {
            return fail(400, { error: 'Invalid media ID' })
        }

        try {
            const [newReview] = await db
                .insert(review)
                .values({
                    body: body.trim(),
                    score: scoreNum,
                    authorId,
                    mediaId: mediaIdNum,
                })
                .returning()

            const reviewWithRelations = await db.query.review.findFirst({
                where: eq(review.id, newReview.id),
                with: {
                    author: true,
                    media: {
                        with: {
                            season: true,
                            series: true,
                        },
                    },
                },
            })

            if (reviewWithRelations) {
                syncReviewToSheet(reviewWithRelations).catch(err => {
                    console.error('Background sheet sync failed:', err)
                })
            }

            throw redirect(303, `/`)
        } catch (error) {
            if (isRedirect(error)) throw error
            console.error('Error creating review:', error)
            return fail(500, { error: 'Failed to create review' })
        }
    },

    update: async ({ request, locals }) => {
        const db = getDb()
        const user = locals.user
        if (!user) return fail(401, { message: 'Unauthorized' })

        const formData = await request.formData()
        const reviewId = Number(formData.get('reviewId'))
        const score = Number(formData.get('score'))
        const body = formData.get('body')?.toString() ?? ''

        // Verify ownership
        const existingReview = await db.query.review.findFirst({
            where: eq(review.id, reviewId),
        })

        if (!existingReview || existingReview.authorId !== user.id) {
            return fail(403, { message: 'Not authorized to edit this review' })
        }

        try {
            // Update the review
            await db.update(review).set({ score, body }).where(eq(review.id, reviewId))

            // Fetch updated review with relations
            const reviewWithRelations = await db.query.review.findFirst({
                where: eq(review.id, reviewId),
                with: {
                    author: true,
                    media: {
                        with: {
                            season: true,
                            series: true,
                        },
                    },
                },
            })

            if (reviewWithRelations) {
                syncReviewToSheet(reviewWithRelations).catch(console.error)
            }

            return { success: true }
        } catch (error) {
            console.error('Failed to update review:', error)
            return fail(500, { message: 'Failed to update review' })
        }
    },

    delete: async ({ request, locals }) => {
        const db = getDb()
        const user = locals.user
        if (!user) return fail(401, { message: 'Unauthorized' })

        const formData = await request.formData()
        const reviewId = Number(formData.get('reviewId'))

        // Fetch review with relations BEFORE deleting (need the data for sheet sync)
        const reviewWithRelations = await db.query.review.findFirst({
            where: eq(review.id, reviewId),
            with: {
                author: true,
                media: {
                    with: {
                        season: true,
                        series: true,
                    },
                },
            },
        })

        if (!reviewWithRelations || reviewWithRelations.authorId !== user.id) {
            return fail(403, { message: 'Not authorized to delete this review' })
        }

        try {
            // Delete from DB
            await db.delete(review).where(eq(review.id, reviewId))

            // Clear from sheet
            clearReviewFromSheet(reviewWithRelations).catch(console.error)

            return { success: true }
        } catch (error) {
            console.error('Failed to delete review:', error)
            return fail(500, { message: 'Failed to delete review' })
        }
    },
}
