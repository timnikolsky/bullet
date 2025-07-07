import type { LocalAdapter } from '$lib/adapters/LocalAdapter';
import type { Page } from '$lib/pages/Page';
import type { PageMeta } from '$lib/types';
import type { WorkspaceConfig } from '$lib/workspace/Workspace.svelte';

export abstract class Adapter {
	static id: string;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static async load(workspaceConfig: WorkspaceConfig): Promise<LocalAdapter> {
		throw new Error('Method not implemented.');
	}

	abstract createPage(id: number, name: string, order: number, parentId: number | null): Promise<Page>;

	abstract getPagesMeta(): Promise<PageMeta[]>;

	abstract getPage(pageId: number): Promise<Page | null>;

	abstract deletePage(pageId: number): Promise<void>;

	abstract updatePageContent(pageId: number, content: string): Promise<void>;
}
