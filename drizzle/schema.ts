import { sqliteTable, AnySQLiteColumn, check, text, integer, foreignKey, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const media = sqliteTable("media", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	series: text(),
	type: text().notNull(),
	season: integer(),
	episode: integer(),
	imdb: text().notNull(),
	primeVideo: text("prime_video").notNull(),
},
(table) => [
	check("episode_check", sql`"media"."type" = 'episode' AND "media"."episode" IS NOT NULL`),
	check("season_check", sql`"media"."type" = 'episode' AND "media"."season" IS NOT NULL`),
]);

export const review = sqliteTable("review", {
	id: text().primaryKey().notNull(),
	body: text().notNull(),
	score: integer().notNull(),
	title: text(),
	authorId: text("author_id").notNull(),
	mediaId: text("media_id").notNull(),
	createDate: integer("create_date").notNull(),
},
(table) => [
	check("episode_check", sql`"media"."type" = 'episode' AND "media"."episode" IS NOT NULL`),
	check("season_check", sql`"media"."type" = 'episode' AND "media"."season" IS NOT NULL`),
]);

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	userId: text().notNull().references(() => user.id),
	expiresAt: integer("expires_at").notNull(),
},
(table) => [
	check("episode_check", sql`"media"."type" = 'episode' AND "media"."episode" IS NOT NULL`),
	check("season_check", sql`"media"."type" = 'episode' AND "media"."season" IS NOT NULL`),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	age: integer(),
	username: text().notNull(),
	passwordHash: text("password_hash").notNull(),
},
(table) => [
	uniqueIndex("user_username_unique").on(table.username),
	check("episode_check", sql`"media"."type" = 'episode' AND "media"."episode" IS NOT NULL`),
	check("season_check", sql`"media"."type" = 'episode' AND "media"."season" IS NOT NULL`),
]);

