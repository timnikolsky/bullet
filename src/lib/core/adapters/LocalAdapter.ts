import { Adapter } from '$lib/core/adapters/Adapter';
import { createDatabaseClient } from '$lib/core/database';
import { pages } from '$lib/core/database/schema';
import { DocumentPage } from '$lib/core/pages/DocumentPage';
import type { Page } from '$lib/core/pages/Page';
import type { PageMeta } from '$lib/types';
import type { WorkspaceConfig } from '$lib/core/workspace/Workspace.svelte';
import { eq } from 'drizzle-orm';

export class LocalAdapter extends Adapter {
	database: Awaited<ReturnType<typeof createDatabaseClient>>;

	private constructor(database: Awaited<ReturnType<typeof createDatabaseClient>>) {
		super();
		this.database = database;
	}

	static async load(workspaceConfig: WorkspaceConfig): Promise<LocalAdapter> {
		const database = await createDatabaseClient(`workspaces/${workspaceConfig.id}/data.sqlite`);
		return new LocalAdapter(database);
	}

	async createPage(
		id: number,
		title: string,
		order: number,
		parentId: number | null
	): Promise<Page> {
		await this.database.insert(pages).values({
			id,
			title,
			type: 'document',
			content: '',
			order,
			parentId
		});

		return new DocumentPage({
			id,
			parentId,
			title,
			type: 'document',
			content: '',
			order
		});
	}

	async getPagesMeta(): Promise<PageMeta[]> {
		const allPages = await this.database.query.pages.findMany({
			columns: {
				id: true,
				type: true,
				title: true,
				order: true,
				parentId: true
			}
		});
		return allPages;
	}

	async getPage(pageId: number): Promise<Page | null> {
		const page = await this.database.query.pages.findFirst({
			where: eq(pages.id, pageId)
		});

		if (!page) return null;

		if (page.type === 'document') {
			return new DocumentPage(page);
		} else {
			throw new Error(`Unsupported page type: ${page.type}`);
		}
	}

	async deletePage(pageId: number): Promise<void> {
		await this.database.delete(pages).where(eq(pages.id, pageId));
	}

	async updatePageContent(pageId: number, content: string): Promise<void> {
		await this.database.update(pages).set({ content }).where(eq(pages.id, pageId));
	}
}
