import type { Adapter } from '$lib/adapters/Adapter';
import { LocalAdapter } from '$lib/adapters/LocalAdapter';
import type { Page } from '$lib/types';

export interface WorkspaceOptions {
	/** id */
	id: string;

	/** Name of the workspace */
	name: string;

	/** Adapter for the workspace */
	adapter: string;
}

export class Workspace {
	/** id */
	id: string;

	/** Name of the workspace */
	name: string;

	/** Adapter for the workspace */
	adapter: Adapter;

	pages: Omit<Page, 'content'>[] = [];

	constructor(options: WorkspaceOptions) {
		this.id = options.id;
		this.name = options.name;
		this.adapter = new LocalAdapter(this);

		this.adapter.getPages().then((pages) => {
			this.pages = pages;
		})
	}

	getPage(pageId: string) {
		return this.adapter.getPage(pageId);
	}
}
