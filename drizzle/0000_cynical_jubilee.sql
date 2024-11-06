CREATE TABLE `asset` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`asset_file` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `instruction` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration` integer,
	`preview_file` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `instruction_to_asset` (
	`instruction_id` text,
	`asset_id` text,
	PRIMARY KEY(`asset_id`, `instruction_id`),
	FOREIGN KEY (`instruction_id`) REFERENCES `instruction`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `step` (
	`id` text PRIMARY KEY NOT NULL,
	`instruction_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`step_nr` integer NOT NULL,
	`attached_file` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	FOREIGN KEY (`instruction_id`) REFERENCES `instruction`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);