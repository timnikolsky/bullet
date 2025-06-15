import { relations } from 'drizzle-orm';
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const pages = sqliteTable('pages', {
	id: int('id').primaryKey(),
	name: text('title').notNull(),
	content: text('content').notNull(),
	order: int('order').notNull().default(0),
	parentId: int('parent_id').notNull().default(0),
});

export const pagesRelations = relations(pages, ({ one, many }) => ({
	parent: one(pages, {
		references: [pages.id],
		fields: [pages.parentId],
	}),
	children: many(pages),
}))
