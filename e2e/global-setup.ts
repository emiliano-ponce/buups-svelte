// e2e/global-setup.ts
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { existsSync, unlinkSync } from 'fs'
import * as schema from '../src/lib/server/db/schema'
import { hashPassword } from '../src/lib/server/password'

async function globalSetup() {
    const dbPath = './test.db'

    if (existsSync(dbPath)) {
        unlinkSync(dbPath)
    }

    const sqlite = new Database(dbPath)
    const db = drizzle(sqlite, { schema })

    migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Migrations applied successfully')

    const passwordHash = await hashPassword('testpassword123')

    const { user, session, series, season, media, review } = schema

    const [insertedUser] = await db
        .insert(user)
        .values({
            username: 'testuser',
            email: 'test@example.com',
            passwordHash,
        })
        .returning()

    await db.insert(session).values({
        id: 'test-session-id',
        userId: insertedUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    })

    const [insertedSeries] = await db
        .insert(series)
        .values({
            id: 1,
            title: 'Star Trek: The Original Series',
            acronym: 'TOS',
            overview: 'The original Star Trek series',
            imageUrl: 'https://example.com/tos.jpg',
            tmdbStats: { voteCount: 1000, voteAvg: 8.5 },
        })
        .returning()

    const [insertedSeason] = await db
        .insert(season)
        .values({
            id: 1,
            title: 'Season 1',
            number: 1,
            overview: 'The first season',
            imageUrl: 'https://example.com/tos-s1.jpg',
            seriesId: insertedSeries.id,
            tmdbStats: { voteCount: 500, voteAvg: 8.3 },
        })
        .returning()

    const [insertedMedia] = await db
        .insert(media)
        .values({
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
        })
        .returning()

    await db.insert(review).values({
        body: 'A classic episode that sets the tone for the series!',
        score: 9,
        authorId: insertedUser.id,
        mediaId: insertedMedia.id,
    })

    sqlite.close()
    console.log('✅ Test database seeded successfully')
}

export default globalSetup
