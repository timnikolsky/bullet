import '$lib/components/blocks/Paragraph.svelte';
import type { LayoutLoad } from './$types';

export const ssr = false;

// const blocks = {
// 	paragraph: Paragraph!
// }

export const load: LayoutLoad = async () => {
	const { workspaceManager } = await import('$lib/workspace/WorkspaceManager.svelte');
	workspaceManager.setCurrentWorkspace(null);

	return {
		workspaceManager
	};
};