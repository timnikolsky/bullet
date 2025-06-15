import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const { workspaceManager } = await import('$lib/workspace/WorkspaceManager.svelte');

	const workspaceId = url.searchParams.get('workspace') ?? url.searchParams.get('w');

	if (!workspaceId) {
		return error(400);
	}

	const workspace = await workspaceManager.getWorkspace(workspaceId);

	if (!workspace) {
		error(404);
	}

	workspaceManager.setCurrentWorkspace(workspaceId);

	return {
		workspaceId
	};
};
