import type { Adapter } from '$lib/core/adapters/Adapter';
import { LocalAdapter } from '$lib/core/adapters/LocalAdapter';
import type { PageMeta } from '$lib/types';
import { Page }  from '$lib/core/pages/Page';

/**
 * Represents the *bullet.json* workspace configuration file contents.
 */
export interface WorkspaceConfig {
	/** Local identifier, also used in the workspace url (/workspaces/:id) */
	id: string;

	/** Includes local or/and remote adapter ids */
	adapters: {
		/** Local adapter id, used if user wants to access data offline. */
		local?: string;
		/** Remote adapter id, used if main source of truth for a workspace is not local. */
		remote?: string;
	};
}

export interface WorkspaceOptions {
	/** id */
	id: string;

	/** Name of the workspace */
	name: string;

	/** Adapter for the workspace */
	adapter: string;
}

export class Workspace {
	/** Local identifier, also used in the workspace url (/workspaces/:id) */
	id: string;

	/** Name of the workspace */
	// name: string;

	/** Adapter for the workspace */
	adapter: Adapter;

	pagesMeta: PageMeta[] = $state([]);

	currentPage: Page | null = $state(null);

	private constructor(id: string, adapter: Adapter) {
		this.id = id;
		this.adapter = adapter;
	}

	static async load(config: WorkspaceConfig): Promise<Workspace> {
		let adapter!: Adapter;
		if (config.adapters.local) {
			adapter = await LocalAdapter.load(config);
		}

		const workspace = new Workspace(config.id, adapter);
		await workspace.loadPagesMeta();
		return workspace;
	}

	async createPage(id: number, title: string, order: number = 0, parentId: number | null = null): Promise<void> {
		const newPage = await this.adapter.createPage(id, title, order, parentId);

		this.pagesMeta.push({
			id: newPage.id,
			type: 'document',
			title: newPage.title,
			order,
			parentId
		});
	}

	private async loadPagesMeta(): Promise<void> {
		this.pagesMeta = await this.adapter.getPagesMeta();
	}

	async openPage(pageId: number): Promise<void> {
		const page = await this.adapter.getPage(pageId);
		this.currentPage = page;
	}

	async deletePage(pageId: number): Promise<void> {
		const deletedPage = this.pagesMeta.find((page) => page.id === pageId);
		if (!deletedPage) return;

		if (this.currentPage?.id === pageId) {
			   this.currentPage = null;
  		}
		this.pagesMeta = this.pagesMeta.filter((page) => page.id !== pageId);

		try {
			await this.adapter.deletePage(pageId);
		} catch {
			this.pagesMeta.push(deletedPage);
		}
	}

	async updatePageContent(pageId: number, content: string): Promise<void> {
		console.time('updatePageContent');
		await this.adapter.updatePageContent(pageId, content);
		console.timeEnd('updatePageContent');
	}
}
