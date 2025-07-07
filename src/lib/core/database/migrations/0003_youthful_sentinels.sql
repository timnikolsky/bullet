PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'document' NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`parent_id` integer
);
--> statement-breakpoint
INSERT INTO `__new_pages`("id", "type", "title", "content", "order", "parent_id") SELECT "id", "type", "title", "content", "order", "parent_id" FROM `pages`;--> statement-breakpoint
DROP TABLE `pages`;--> statement-breakpoint
ALTER TABLE `__new_pages` RENAME TO `pages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;