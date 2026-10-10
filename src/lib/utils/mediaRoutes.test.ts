import { describe, expect, it } from 'vitest'
import { getMediaBreadcrumbs, getMediaLink } from './mediaLinks'
import { episodeHref, getAdjacent, parseRouteInt, seasonHref, seriesHref } from './mediaRoutes'

describe('route builders', () => {
    it('match mediaLinks output', () => {
        const media = {
            id: 1,
            type: 'episode',
            title: 'Yesterday',
            episode: 15,
            series: { acronym: 'TNG' },
            season: { number: 3 },
        } as unknown as Parameters<typeof getMediaLink>[0]
        expect(episodeHref('TNG', 3, 15)).toBe(getMediaLink(media))
        const crumbs = getMediaBreadcrumbs(media).map(c => c.href)
        expect(crumbs).toContain(seasonHref('TNG', 3))
        expect(seriesHref("V'GER")).toBe("/series/V'GER")
    })
})

describe('parseRouteInt', () => {
    it('accepts non-negative integers', () => {
        expect(parseRouteInt('0')).toBe(0)
        expect(parseRouteInt('15')).toBe(15)
    })
    it('rejects anything else', () => {
        for (const v of ['', '-1', '1.5', 'abc', '3e2', '99999']) expect(parseRouteInt(v)).toBeNull()
    })
})

describe('getAdjacent', () => {
    const list = [1, 2, 3]
    it('returns neighbours', () => expect(getAdjacent(list, x => x === 2)).toEqual({ prev: 1, next: 3 }))
    it('handles edges', () => {
        expect(getAdjacent(list, x => x === 1)).toEqual({ prev: null, next: 2 })
        expect(getAdjacent(list, x => x === 3)).toEqual({ prev: 2, next: null })
    })
    it('handles missing', () => expect(getAdjacent(list, x => x === 9)).toEqual({ prev: null, next: null }))
})
