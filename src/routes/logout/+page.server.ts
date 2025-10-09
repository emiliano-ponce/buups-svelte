import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    default: async event => {
        if (event.locals.session) {
            await invalidateSession(event.locals.session.id)
            deleteSessionTokenCookie(event)
        }

        throw redirect(303, '/login')
    },
}
