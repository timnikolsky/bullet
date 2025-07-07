import { Workspace, type WorkspaceConfig } from '$lib/core/workspace/Workspace.svelte';
import { BaseDirectory, create, exists, mkdir, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { SvelteMap } from 'svelte/reactivity';

const fsOptions = {
	baseDir: BaseDirectory.AppData
};

export class WorkspaceManager {
	workspaceConfigs: SvelteMap<string, WorkspaceConfig> = new SvelteMap();
	workspace: Workspace | null = null;
 
	private constructor() {

	}

	/** Init method. Use this instead of constructor */
	static async load(): Promise<WorkspaceManager> {
		const instance = new WorkspaceManager();
		await instance.loadWorkspacesConfigs();
		return instance;
	}

	async loadWorkspacesConfigs() {
		const workspacesDirExists = await exists('workspaces', fsOptions);

		if (!workspacesDirExists) {
			await mkdir('workspaces', fsOptions);
		}

		const workspacesEntries = await readDir('workspaces', fsOptions);
		const workspacesDirectories = workspacesEntries.filter((entry) => entry.isDirectory);

		for (const directory of workspacesDirectories) {
			const workspaceConfigFileExists = await exists(
				`workspaces/${directory.name}/bullet.json`,
				fsOptions
			);

			if (!workspaceConfigFileExists) return;

			const workspaceConfigFile = await readTextFile(
				`workspaces/${directory.name}/bullet.json`,
				fsOptions
			);

			const workspaceConfig = JSON.parse(workspaceConfigFile) as WorkspaceConfig;

			this.workspaceConfigs.set(workspaceConfig.id, workspaceConfig);
		}
	}

	async loadWorkspace(id: string): Promise<Workspace | null> {
		const workspaceConfigFileExists = await exists(`workspaces/${id}/bullet.json`, fsOptions);

		if (!workspaceConfigFileExists) {
			return null;
		}

		const workspaceConfigFile = await readTextFile(`workspaces/${id}/bullet.json`, fsOptions);
		const workspaceConfig = JSON.parse(workspaceConfigFile) as WorkspaceConfig;
		const workspace = await Workspace.load(workspaceConfig);
 
		return workspace;
	}

	// async getWorkspace(id: string): Promise<Workspace | null> {
	// 	if (this.workspaces.has(id)) {
	// 		return this.workspaces.get(id) || null;
	// 	}

	// 	const workspaceConfigFileExists = await exists(`workspaces/${id}/bullet.json`, fsOptions);

	// 	if (!workspaceConfigFileExists) {
	// 		return null;
	// 	}

	// 	const workspaceConfigFile = await readTextFile(`workspaces/${id}/bullet.json`, fsOptions);
	// 	const workspaceConfig = JSON.parse(workspaceConfigFile) as WorkspaceOptions;
	// 	const workspace = new Workspace(workspaceConfig);
	// 	this.workspaces.set(workspace.id, workspace);

	// 	return workspace;
	// }

	// setCurrentWorkspace(workspaceId: string | null) {
	// 	if (workspaceId === null) {
	// 		this.currentWorkspaceId = null;
	// 		this.currentWorkspace = null;
	// 		return;
	// 	}

	// 	const workspace = this.workspaces.get(workspaceId);
	// 	if (workspace) {
	// 		this.currentWorkspaceId = workspaceId;
	// 		this.currentWorkspace = workspace;
	// 	} else {
	// 		console.error(`Workspace with id ${workspaceId} not found.`);
	// 	}
	// }

	async createWorkspace(id: string) {
		await mkdir(`workspaces/${id}`, fsOptions);
		const workspaceConfig: WorkspaceConfig = {
			id,
			adapters: {
				local: 'local'
			}
		}
		const file = await create(`workspaces/${id}/bullet.json`, fsOptions);
		await file.write(new TextEncoder().encode(JSON.stringify(workspaceConfig)));
		await file.close();
		this.workspaceConfigs.set(id, workspaceConfig);
	}
}

export const workspaceManager = await WorkspaceManager.load();
