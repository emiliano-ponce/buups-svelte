import { describe, expect, it } from 'vitest'
import {
    aggregateScores,
    biggestDisagreements,
    bottomRated,
    formatScore,
    getMediaScores,
    mean,
    topRated,
    type StatsMedia,
} from './seriesStats'

const E = 'Emiliano'
const J = 'jars'

const ep = (id: number, reviews: StatsMedia['reviews'], season = 1): StatsMedia => ({
    id,
    title: `Ep ${id}`,
    type: 'episode',
    seasonNumber: season,
    episode: id,
    reviews,
})

describe('mean', () => {
    it('returns null for empty input', () => expect(mean([])).toBeNull())
    it('averages values', () => expect(mean([1, 2, 6])).toBe(3))
})

describe('getMediaScores', () => {
    it('averages duplicate reviews per person before combining', () => {
        const s = getMediaScores(
            ep(1, [
                { author: E, score: 4 },
                { author: E, score: 8 },
                { author: J, score: 10 },
            ])
        )
        expect(s).toEqual({ emiliano: 6, jars: 10, overall: 8 })
    })
    it('uses the single reviewer when only one has rated', () => {
        expect(getMediaScores(ep(1, [{ author: J, score: 7 }]))).toEqual({ emiliano: null, jars: 7, overall: 7 })
    })
    it('ignores unknown authors', () => {
        expect(getMediaScores(ep(1, [{ author: 'someone', score: 1 }]))).toEqual({
            emiliano: null,
            jars: null,
            overall: null,
        })
    })
})

describe('aggregateScores', () => {
    it('averages per-episode scores over rated episodes only', () => {
        const items = [
            ep(1, [
                { author: E, score: 10 },
                { author: J, score: 6 },
            ]),
            ep(2, [{ author: E, score: 4 }]),
            ep(3, []),
        ]
        expect(aggregateScores(items)).toEqual({ emiliano: 7, jars: 6, overall: 6, total: 3, rated: 2 })
    })
    it('returns nulls when nothing is rated', () => {
        expect(aggregateScores([ep(1, [])])).toEqual({ emiliano: null, jars: null, overall: null, total: 1, rated: 0 })
    })
})

describe('rankings', () => {
    const items = [
        ep(1, [
            { author: E, score: 9 },
            { author: J, score: 9 },
        ]),
        ep(2, [
            { author: E, score: 2 },
            { author: J, score: 8 },
        ]),
        ep(3, [{ author: E, score: 1 }]),
        ep(4, []),
    ]
    it('topRated sorts high to low and skips unrated', () => {
        expect(topRated(items).map(s => s.media.id)).toEqual([1, 2, 3])
    })
    it('bottomRated sorts low to high', () => {
        expect(bottomRated(items, 2).map(s => s.media.id)).toEqual([3, 2])
    })
    it('biggestDisagreements needs both reviewers and a non-zero gap', () => {
        const d = biggestDisagreements(items)
        expect(d.map(s => s.media.id)).toEqual([2])
        expect(d[0].diff).toBe(6)
    })
})

describe('formatScore', () => {
    it('formats numbers and N/A', () => {
        expect(formatScore(7.25)).toBe('7.3')
        expect(formatScore(null)).toBe('N/A')
    })
})
