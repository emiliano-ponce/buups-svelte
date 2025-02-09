-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`series` text,
	`type` text NOT NULL,
	`season` integer,
	`episode` integer,
	`imdb` text NOT NULL,
	`prime_video` text NOT NULL,
	CONSTRAINT "episode_check" CHECK("media"."type" = 'episode' AND "media"."episode" IS NOT NULL),
	CONSTRAINT "season_check" CHECK("media"."type" = 'episode' AND "media"."season" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE `review` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`score` integer NOT NULL,
	`title` text,
	`author_id` text NOT NULL,
	`media_id` text NOT NULL,
	`create_date` integer NOT NULL,
	CONSTRAINT "episode_check" CHECK("media"."type" = 'episode' AND "media"."episode" IS NOT NULL),
	CONSTRAINT "season_check" CHECK("media"."type" = 'episode' AND "media"."season" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "episode_check" CHECK("media"."type" = 'episode' AND "media"."episode" IS NOT NULL),
	CONSTRAINT "season_check" CHECK("media"."type" = 'episode' AND "media"."season" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	CONSTRAINT "episode_check" CHECK("media"."type" = 'episode' AND "media"."episode" IS NOT NULL),
	CONSTRAINT "season_check" CHECK("media"."type" = 'episode' AND "media"."season" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);
*/