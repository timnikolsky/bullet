import { Workspace, type WorkspaceOptions } from '$lib/workspace/Workspace';
import { BaseDirectory, create, exists, mkdir, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { SvelteMap } from 'svelte/reactivity';

const fsOptions = {
	baseDir: BaseDirectory.AppData
};

export class WorkspaceManager {
	workspaces = $state(new SvelteMap<string, Workspace>());
	currentWorkspaceId: string | null = $state(null);
	currentWorkspace: Workspace | null = $state(null);
	workspacesLoadPromise: Promise<void>;

	constructor() {
		this.workspacesLoadPromise = new Promise(() => {})
		this.loadWorkspaces();
	}

	async loadWorkspaces() {
		const workspacesDirExists = await exists('workspaces', fsOptions);

		if (!workspacesDirExists) {
			await mkdir('workspaces', {
				baseDir: BaseDirectory.AppData
			});
		}

		const workspacesEntries = await readDir('workspaces', fsOptions);

		workspacesEntries.forEach(async (entry) => {
			if (!entry.isDirectory) return;

			const workspaceConfigFileExists = await exists(
				`workspaces/${entry.name}/bullet.json`,
				fsOptions
			);

			if (!workspaceConfigFileExists) return;

			const workspaceConfigFile = await readTextFile(
				`workspaces/${entry.name}/bullet.json`,
				fsOptions
			);

			const workspaceConfig = JSON.parse(workspaceConfigFile) as WorkspaceOptions;

			const workspace = new Workspace(workspaceConfig);

			this.workspaces.set(workspace.id, workspace);
		});
	}

	async getWorkspace(id: string): Promise<Workspace | null> {
		if (this.workspaces.has(id)) {
			return this.workspaces.get(id) || null;
		}

		const workspaceConfigFileExists = await exists(`workspaces/${id}/bullet.json`, fsOptions);

		if (!workspaceConfigFileExists) {
			return null;
		}

		const workspaceConfigFile = await readTextFile(`workspaces/${id}/bullet.json`, fsOptions);
		const workspaceConfig = JSON.parse(workspaceConfigFile) as WorkspaceOptions;
		const workspace = new Workspace(workspaceConfig);
		this.workspaces.set(workspace.id, workspace);

		return workspace;
	}

	setCurrentWorkspace(workspaceId: string | null) {
		if (workspaceId === null) {
			this.currentWorkspaceId = null;
			this.currentWorkspace = null;
			return;
		}

		const workspace = this.workspaces.get(workspaceId);
		if (workspace) {
			this.currentWorkspaceId = workspaceId;
			this.currentWorkspace = workspace;
		} else {
			console.error(`Workspace with id ${workspaceId} not found.`);
		}
	}

	async createWorkspace(id: string, name: string) {
		await mkdir(`workspaces/${id}`, fsOptions);
		const file = await create(`workspaces/${id}/bullet.json`, fsOptions);
		await file.write(new TextEncoder().encode(JSON.stringify({ id, name, provider: 'local' })));
		await file.close();
		const workspace = new Workspace({ id, name, adapter: 'local' });
		this.workspaces.set(id, workspace);
	}
}

export const workspaceManager = new WorkspaceManager();
