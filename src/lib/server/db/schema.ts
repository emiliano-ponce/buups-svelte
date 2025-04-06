import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// User
export const user = sqliteTable('user', {
    id: text()
        .primaryKey()
        .$defaultFn(() => createId()),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    passwordHash: text('password_hash').notNull(),
})
export type User = typeof user.$inferSelect

export const userRelations = relations(user, ({ many }) => ({
    reviews: many(review),
}))

// End User

// Session
export const session = sqliteTable('session', {
    id: text().primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})
export type Session = typeof session.$inferSelect

// End Session

// Review
export const review = sqliteTable('review', {
    id: integer().primaryKey(),
    body: text().notNull(),
    score: integer().notNull(),
    authorId: text('author_id').notNull(),
    mediaId: integer('media_id').notNull(),
    createDt: integer('create_date', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
})
export type Review = typeof review.$inferSelect

export const reviewRelations = relations(review, ({ one }) => ({
    author: one(user, {
        fields: [review.authorId],
        references: [user.id], 
    }),
    media: one(media, {
        fields: [review.mediaId],
        references: [media.id],
    }),
}))

// End Review

const tmdbStats = text('tmdb_stats', { mode: 'json' }).$type<{ voteCount: number; voteAvg: number }>().notNull();

// Media
export const media = sqliteTable(
    'media',
    {
        id: integer().primaryKey(),
        title: text().notNull(),
        overview: text().notNull(),
        date: text().notNull(),
        seriesId: integer('series_id').notNull(),
        type: text({ enum: ['movie', 'episode', 'special'] }).notNull(),
        imageUrl: text('image_url'),
        seasonId: integer('season_id'),
        episode: integer().notNull(),
        tmdbStats,
        createDt: integer('create_date', { mode: 'timestamp' })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    table => [
        check(
            'episode_check',
            sql`${table.type} <> 'episode' OR (${table.type} = 'episode' AND ${table.episode} IS NOT NULL)`
        ),
        check(
            'season_check',
            sql`${table.type} <> 'episode' OR (${table.type} = 'episode' AND ${table.seasonId} IS NOT NULL)`
        ),
    ]
)
export type Media = typeof media.$inferSelect

export const mediaRelations = relations(media, ({ one, many }) => ({
    season: one(season, {
      fields: [media.seasonId],
      references: [season.id],
    }),
    series: one(series, {
        fields: [media.seriesId],
        references: [series.id],
    }),
    reviews: many(review),
}))

// End Media

// Season
export const season = sqliteTable('season', {
    id: integer().primaryKey(),
    title: text().notNull(),
    number: integer().notNull(),
    overview: text().notNull(),
    imageUrl: text('image_url'),
    seriesId: integer('series_id').notNull(),
    tmdbStats,
})
export type Season = typeof season.$inferSelect

export const seasonRelations = relations(season, ({ one, many }) => ({
    series: one(series, {
        fields: [season.seriesId],
        references: [series.id],
    }),
    media: many(media),
}))

// End Season

// Series
export const series = sqliteTable('series', {
    id: integer().primaryKey(),
    title: text().notNull(),
    acronym: text({ enum: ['TOS', 'TAS', 'TNG', 'DS9', "V'GER", 'ENT', 'DIS', 'PIC', 'LWD', 'SNW'] }).notNull(),
    overview: text().notNull(),
    imageUrl: text('image_url'),
    tmdbStats,
})
export type Series = typeof series.$inferSelect

export const seriesRelations = relations(series, ({ many }) => ({
    seasons: many(season),
    media: many(media),
}))

// End Series
