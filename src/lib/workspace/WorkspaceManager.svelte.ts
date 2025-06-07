import { Workspace, type WorkspaceOptions } from '$lib/workspace/Workspace';
import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { SvelteMap } from 'svelte/reactivity';

export class WorkspaceManager {
	workspaces = $state(new SvelteMap<string, Workspace>());
	currentWorkspaceId: string | null = $state(null);
	currentWorkspace: Workspace | null = $state(null);

	constructor() {
		this.loadWorkspaces();
	}

	async loadWorkspaces() {
		const workspacesFileExists = await exists('workspaces.json', {
			baseDir: BaseDirectory.AppData
		});

		if (!workspacesFileExists) {
			await writeTextFile('workspaces.json', '[]', {
				baseDir: BaseDirectory.AppData
			});
			return;
		}

		const file = await readTextFile('workspaces.json', {
			baseDir: BaseDirectory.AppData
		});

		const workspacesData = JSON.parse(file) as Array<WorkspaceOptions>;
		for (const workspaceData of workspacesData) {
			const workspace = new Workspace(workspaceData);
			this.workspaces.set(workspace.id, workspace);
		}
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
}

export const workspaceManager = new WorkspaceManager();
