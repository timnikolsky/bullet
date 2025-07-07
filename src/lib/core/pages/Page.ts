import type { pages } from '$lib/database/schema';

export abstract class Page {
	static type: string;
	id: number;
	content: string;
	title: string;

	constructor(data: typeof pages.$inferSelect) {
		this.id = data.id;
		this.content = data.content;
		this.title = data.title;
	}
}
