<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { workspaceManager } from '$lib/workspace/WorkspaceManager.svelte';

	let workspaces = $derived([...workspaceManager.workspaces.values()]);
	workspaceManager.setCurrentWorkspace(null);

	function handleCreateWorkspace() {
		const id = prompt('Enter workspace ID:');
		if (!id) {
			alert('Workspace ID is required.');
			return;
		}
		const name = prompt('Enter workspace name:');
		if (!name) {
			alert('Workspace name is required.');
			return;
		}
		workspaceManager.createWorkspace(id, name);
	}
</script>

<main>
	<div class="container">
		<h1>Workspaces</h1>
		<div class="workspaces-list">
			{#each workspaces as workspace}
				<a href="/workspace?w={workspace.id}" class="workspace-link">
					<div class="workspace-card">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.5 7.5V15C15.5 15.8284 14.8284 16.5 14 16.5H7C6.17157 16.5 5.5 15.8284 5.5 15V5C5.5 4.17157 6.17157 3.5 7 3.5H11.5M15.5 7.5L11.5 3.5M15.5 7.5H12.5C11.9477 7.5 11.5 7.05228 11.5 6.5V3.5" stroke="currentColor" stroke-linejoin="round"/>
						</svg>
						<span>{workspace.name}</span>
					</div>
				</a>
			{/each}
			{#if workspaces.length === 0}
				<p>No workspaces available. Create a new one!</p>
			{/if}
			<button class="workspace-create-button" onclick={handleCreateWorkspace}>
				Create a new workspace
			</button>
		</div>
	</div>
</main>

<style lang="scss">
	main {
		border-radius: 0.5rem;
		flex: 1;
		background: var(--color-surface);
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container {
		max-width: 40rem;
		width: 100%;
		height: 100%;
		max-height: 35rem;
	}

	.workspaces-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		flex-direction: column;
		gap: 0.5rem;
	}

	.workspace-link {
		all: unset;
		display: contents;
	}

	.workspace-card {
		background: var(--color-card-background);
		border: 1px solid var(--color-card-border);
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		gap: 0.5rem;
		transition: background 0.1s ease;
		color: var(--color-foreground);
		font-size: 0.875rem;
		cursor: pointer;
		align-items: center;
	}

	.workspace-create-button {
		border: 1px solid var(--color-card-border);
		border-radius: 0.5rem;
		background: transparent;
		color: var(--color-foreground);
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		padding: 1rem;
		cursor: pointer;
	}
</style>
