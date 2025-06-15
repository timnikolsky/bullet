import { Adapter } from '$lib/adapters/Adapter';
import type { Page } from '$lib/types';
import type { Workspace } from '$lib/workspace/Workspace';
import { BaseDirectory, create, exists, open, type FileHandle } from '@tauri-apps/plugin-fs';

const fsOptions = {
	baseDir: BaseDirectory.AppData
};

export class LocalAdapter extends Adapter {
	workspace: Workspace;
	json: unknown;
	jsonFile!: FileHandle;

	constructor(workspace: Workspace) {
		super();
		this.workspace = workspace;
	}

	async setupJsonFile(): Promise<void> {
		const fileExists = await exists(`workspaces/${this.workspace.id}/data.json`, fsOptions);
		if (!fileExists) {
			this.jsonFile = await create(`workspaces/${this.workspace.id}/data.json`, fsOptions);
			return;
		}
		this.jsonFile = await open(`workspaces/${this.workspace.id}/data.json`, fsOptions);
	}

	async writeToJson(data: unknown): Promise<void> {
		this.json = data;
		await this.jsonFile.write(new TextEncoder().encode(JSON.stringify(data, null, 2)));
	}

	async handleClose() {
		if (this.jsonFile) {
			await this.jsonFile.close();
		}
	}

	async createPage(name: string): Promise<Page> {
		return {
			id: '1',
			type: 'document',
			content: {},
			name
		};
	}

	async getPages(): Promise<Omit<Page, 'content'>[]> {
		return [
			{
				id: '1',
				type: 'document',
				name: 'Home'
			},
			{
				id: '2',
				type: 'document',
				name: 'About'
			},
			{
				id: '3',
				type: 'document',
				name: 'Contact'
			}
		];
	}

	async getPage(pageId: string): Promise<Page> {
		return {
			id: pageId,
			type: 'document',
			name: 'Sample Page',
			content: {}
		};
	}
}
