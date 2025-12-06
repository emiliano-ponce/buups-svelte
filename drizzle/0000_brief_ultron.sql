CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`overview` text NOT NULL,
	`date` text NOT NULL,
	`series_id` integer NOT NULL,
	`type` text NOT NULL,
	`image_url` text,
	`season_id` integer,
	`episode` integer NOT NULL,
	`tmdb_stats` text NOT NULL,
	`create_date` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "episode_check" CHECK("media"."type" <> 'episode' OR ("media"."type" = 'episode' AND "media"."episode" IS NOT NULL)),
	CONSTRAINT "season_check" CHECK("media"."type" <> 'episode' OR ("media"."type" = 'episode' AND "media"."season_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `review` (
	`id` integer PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`score` integer NOT NULL,
	`author_id` text NOT NULL,
	`media_id` integer NOT NULL,
	`create_date` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `season` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`number` integer NOT NULL,
	`overview` text NOT NULL,
	`image_url` text,
	`series_id` integer NOT NULL,
	`tmdb_stats` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`acronym` text NOT NULL,
	`overview` text NOT NULL,
	`image_url` text,
	`tmdb_stats` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);