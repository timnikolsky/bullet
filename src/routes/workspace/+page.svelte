<script lang="ts">
	import Editor from '$lib/components/editor/Editor.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { workspaceManager } from '$lib/workspace/WorkspaceManager.svelte';

	const { data } = $props();

	const workspace = workspaceManager.workspaces.get(data.workspaceId)!;

	let views: View | ViewStack | null = $state({
		id: 'view1',
		tabs: ['1']
	});

	interface ViewStack {
		direction: 'horizontal' | 'vertical';
		items: (View | ViewStack)[];
	}

	interface View {
		id: string;
		tabs: string[];
	}
</script>

<Sidebar />
<main class="views">
	{#if !views}
		<div class="view">Nothing opened</div>
	{:else}
		{@render item(views)}
	{/if}
</main>

{#snippet item(item: View | ViewStack)}
	{#if 'items' in item}
		{@render stack(item)}
	{:else}
		{@render view(item)}
	{/if}
{/snippet}

{#snippet stack(stack: ViewStack)}
	<div class="stack" style:flex-direction={stack.direction === 'vertical' ? 'column' : 'row'}>
		{#each stack.items as viewOrStack}
			{@render item(viewOrStack)}
		{/each}
	</div>
{/snippet}

{#snippet view(view: View)}
	<div class="view">
		<div class="text-page">
			<div class="content">
				<h1 class="title">This is my home page</h1>
				<Editor bind:value={view.id} />
			</div>
		</div>
	</div>
{/snippet}

<style>
	.views {
		flex: 1;
		display: flex;
	}

	.stack {
		display: flex;
		gap: 0.5rem;
		flex: 1;
	}

	.view {
		background: var(--color-surface);
		border-radius: 0.5rem;
		flex: 1;
		position: relative;
		overflow-y: auto;
	}

	.text-page {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 1rem;

		.content {
			width: 100%;
			max-width: 40rem;
		}
	}

	.title {
		font-family: var(--font-family-heading, Merriweather, sans-serif);
		margin: 0;
		font-size: 2.5rem;
		line-height: 3rem;
		margin-top: 3rem;
		margin-bottom: 1rem;
	}
</style>
