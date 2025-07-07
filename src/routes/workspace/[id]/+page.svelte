<script lang="ts">
	import { page } from '$app/state';
	import type { Workspace } from '$lib/core/workspace/Workspace.svelte';
	import { workspaceManager } from '$lib/core/workspace/WorkspaceManager.svelte';
	import { onMount } from 'svelte';
	import WorkspaceView from './WorkspaceView.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let workspace: Workspace | null = $state(null);
	let error: string | null = $state(null);

	onMount(async () => {
		workspace = await workspaceManager.loadWorkspace(page.params.id);

		if (!workspace) {
			error = `Workspace with ID ${page.params.id} not found.`;
		}
	});
</script>

<Sidebar {workspace} />

{#if workspace}
	<WorkspaceView {workspace} />
{:else if error}
	<p>{error}</p>
{:else}
	<p>Loading workspace...</p>
{/if}
