// reviews/+page.server.ts
import { db } from '$lib/server/db'
import { review } from '$lib/server/db/schema'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData()
        const body = data.get('body')
        const score = data.get('score')
        const authorId = data.get('authorId')
        const mediaId = data.get('mediaId')

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
            await db.insert(review).values({
                body: body.trim(),
                score: scoreNum,
                authorId,
                mediaId: mediaIdNum,
            })

            throw redirect(303, `/`)
        } catch (error) {
            if (error instanceof Response) throw error
            console.error('Error creating review:', error)
            return fail(500, { error: 'Failed to create review' })
        }
    },
}
