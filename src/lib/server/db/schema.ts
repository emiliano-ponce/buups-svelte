import { relations, sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// User
export const user = sqliteTable('user', {
  id: text().primaryKey(),
  age: integer(),
  username: text().notNull().unique(),
  passwordHash: text('password_hash').notNull()
});
export type User = typeof user.$inferSelect;

export const userRelations = relations(user, ({ many }) => ({
  reviews: many(review)
}));

// End User

// Session
export const session = sqliteTable('session', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});
export type Session = typeof session.$inferSelect;

// End Session

// Review
export const review = sqliteTable('review', {
  id: text().primaryKey(),
  body: text().notNull(),
  score: integer().notNull(),
  title: text(),
  authorId: text('author_id').notNull(),
  mediaId: text('media_id').notNull(),
  createDt: integer('create_date', { mode: 'timestamp' }).notNull()
});
export type Review = typeof review.$inferSelect;

export const reviewRelations = relations(review, ({ one }) => ({
  author: one(user, {
    fields: [review.authorId],
    references: [user.id]
  }),
  media: one(media, {
	fields: [review.mediaId],
	references: [media.id]
  })
}));

// End Review

// Media
export const media = sqliteTable(
  'media',
  {
    id: text().primaryKey(),
    title: text().notNull(),
    series: text({ enum: ['TOS', 'TAS', 'TNG', 'DS9', 'VOY', 'ENT', 'PIC'] }),
    type: text({ enum: ['movie', 'episode', 'special'] }).notNull(),
    season: integer(),
    episode: integer(),
    imdb: text().notNull(),
    primeVideo: text('prime_video').notNull(),
    createDt: integer('create_date', { mode: 'timestamp' }).notNull()
  },
  (table) => [
    check('episode_check', sql`${table.type} = 'episode' AND ${table.episode} IS NOT NULL`),
    check('season_check', sql`${table.type} = 'episode' AND ${table.season} IS NOT NULL`)
  ]
);
export type Media = typeof media.$inferSelect;

export const mediaRelations = relations(media, ({ many }) => ({
	reviews: many(review)
}));

// End Media
