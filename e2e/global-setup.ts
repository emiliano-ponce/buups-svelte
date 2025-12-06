// e2e/global-setup.ts
import { hash } from '@node-rs/argon2'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { media, review, season, series, session, user } from '../src/lib/server/db/schema'

async function globalSetup() {
    const testDb = new Database('./test.db')
    const db = drizzle(testDb)

    // Run migrations
    migrate(db, { migrationsFolder: './drizzle' })

    // Seed test data
    const passwordHash = await hash('testpassword123')

    // Insert user
    const [insertedUser] = await db.insert(user).values({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
    }).returning()

    // Insert session
    await db.insert(session).values({
        id: 'test-session-id',
        userId: insertedUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    })

    // Insert series
    const [insertedSeries] = await db.insert(series).values({
        id: 1,
        title: 'Star Trek: The Original Series',
        acronym: 'TOS',
        overview: 'The original Star Trek series',
        imageUrl: 'https://example.com/tos.jpg',
        tmdbStats: { voteCount: 1000, voteAvg: 8.5 },
    }).returning()

    // Insert season
    const [insertedSeason] = await db.insert(season).values({
        id: 1,
        title: 'Season 1',
        number: 1,
        overview: 'The first season',
        imageUrl: 'https://example.com/tos-s1.jpg',
        seriesId: insertedSeries.id,
        tmdbStats: { voteCount: 500, voteAvg: 8.3 },
    }).returning()

    // Insert media (episode)
    const [insertedMedia] = await db.insert(media).values({
        id: 1,
        title: 'The Man Trap',
        overview: 'The crew encounters a shape-shifting creature',
        date: '1966-09-08',
        seriesId: insertedSeries.id,
        type: 'episode',
        imageUrl: 'https://example.com/man-trap.jpg',
        seasonId: insertedSeason.id,
        episode: 1,
        tmdbStats: { voteCount: 100, voteAvg: 7.8 },
    }).returning()

    // Insert review
    await db.insert(review).values({
        body: 'A classic episode that sets the tone for the series!',
        score: 9,
        authorId: insertedUser.id,
        mediaId: insertedMedia.id,
    })

    testDb.close()
    console.log('✅ Test database seeded successfully')
}

export default globalSetup