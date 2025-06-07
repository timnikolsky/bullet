<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { workspaceManager } from '$lib/workspace/WorkspaceManager.svelte';

	let workspaces = $derived([...workspaceManager.workspaces.values()]);
	workspaceManager.setCurrentWorkspace(null);
</script>

<main>
	Your workspaces:
	<ul>
		{#each workspaces as workspace}
			<li>
				<a
					href="/workspace"
					onclick={() => workspaceManager.setCurrentWorkspace(workspace.id)}
				>
					{workspace.name}
				</a>
			</li>
		{/each}
	</ul>
	<button onclick={() => console.log(workspaceManager.workspaces.values())}> hey </button>
</main>

<style lang="scss">
	main {
		border-radius: 0.5rem;
		flex: 1;
		background: var(--color-surface);
		padding: 1rem;
	}
</style>
