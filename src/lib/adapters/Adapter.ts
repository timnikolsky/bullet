import type { Page } from '$lib/types';

export abstract class Adapter {
	static id: string;

	abstract createPage(name: string): Promise<Page>;

	abstract getPages(): Promise<Omit<Page, 'content'>[]>;

	abstract getPage(pageId: string): Promise<Page>;
}