import { relations } from 'drizzle-orm';
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const pages = sqliteTable('pages', {
	id: int('id').primaryKey(),
	type: text('type').notNull().default('document'),
	title: text('title').notNull(),
	content: text('content').notNull(),
	order: int('order').notNull().default(0),
	parentId: int('parent_id')
});

export const pagesRelations = relations(pages, ({ one, many }) => ({
	parent: one(pages, {
		references: [pages.id],
		fields: [pages.parentId]
	}),
	children: many(pages)
}));

export const meta = sqliteTable('meta', {
	key: text('key').primaryKey(),
	value: text('value').notNull()
});
