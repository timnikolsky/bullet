<script lang="ts">
	import Editor from '$lib/components/editor/Editor.svelte';
	import { DocumentPage } from '$lib/core/pages/DocumentPage';
	import type { Workspace } from '$lib/core/workspace/Workspace.svelte';
	const { convertFileSrc } = window.__TAURI__.core;

	const { workspace }: { workspace: Workspace } = $props();

	// let views: View | ViewStack | null = $state({
	// 	id: 'view1',
	// });

	// interface ViewStack {
	// 	direction: 'horizontal' | 'vertical';
	// 	items: (View | ViewStack)[];
	// }

	// interface View {
	// 	id: string;
	// }
</script>

<main class="views">
	{#if workspace.currentPage}
		<div class="view">
			{#if workspace.currentPage instanceof DocumentPage}
				<div class="document-page">
					<div class="cover" style:background-image={workspace.currentPage.id % 2 ? 'url("/bg.png")' : 'url("/bg.webp")'}></div>
					<div class="content">
						<img
							class="page-icon"
							src="/page-icon.webp"
							alt="icon"
						/>
						<h1 class="title">{workspace.currentPage.title}</h1>
						{#key workspace.currentPage.id}
							<Editor page={workspace.currentPage} {workspace} />
						{/key}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="view">Nothing opened</div>
	{/if}
</main>

<!-- <main class="views">
	{#if !views}
		<div class="view">Nothing opened</div>
	{:else}
		{@render item(views)}
	{/if}
</main> -->

<!-- {#snippet item(item: View | ViewStack)}
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
{/snippet} -->

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

	.cover {
		height: 15rem;
		width: 100%;
		background-image: url("/bg.png");
		background-position: center;
		background-size: cover;
	}

	.document-page {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.content {
		width: 100%;
		max-width: 40rem;
		margin-inline: 1rem;
	}

	.page-icon {
		width: 8rem;
		height:  8rem;
		border-radius: 0.5rem;
		margin-top: -4rem;
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
