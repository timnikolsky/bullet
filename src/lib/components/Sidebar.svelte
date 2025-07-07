<script lang="ts">
	import type { PageMeta } from '$lib/types';
	import type { Workspace } from '$lib/workspace/Workspace.svelte';
	import Resizer from './Resizer.svelte';

	const { workspace }: { workspace: Workspace | null } = $props();

	const minWidth = 200;
	const maxWidth = 600;

	// let width = $state(getInitialWidth());
	let width = $state(getInitialWidth());
	let hidden = $state(false);

	let newPageName = $state('');

	function onresize(x: number, y: number) {
		hidden = x - 8 < minWidth / 2;
		width = Math.min(Math.max(x - 8, minWidth), maxWidth);
		localStorage.setItem('sidebarWidth', width.toString());
	}

	function getInitialWidth() {
		const savedWidth = localStorage.getItem('sidebarWidth');
		return savedWidth ? parseInt(savedWidth, 10) : 240;
	}

	async function createPage(id: number, parentId: number | null, order: number) {
		if (newPageName.trim() === '') return;

		await workspace?.createPage(id, newPageName.trim(), order, parentId);
		newPageName = '';
	}
</script>

<aside class="sidebar" class:hidden style:--width="{width}px">
	{#if workspace}
		<div class="section">
			<div class="label">
				<span class="label-text">Pages</span>
				<div>
					<input id="page-name" bind:value={newPageName} placeholder="New page name" />
					<button onclick={() => createPage(Math.floor(Math.random() * 999999), null, workspace.pagesMeta.length)}>+</button>
				</div>
			</div>
			<div class="pages">
				{#each workspace.pagesMeta.toSorted((a, b) => a.order - b.order) as pageMeta (pageMeta.id)}
					<div class="page">
						<button class="page-button" onclick={() => workspace.openPage(pageMeta.id)}>
							<span class="page-title">{pageMeta.title}</span>
						</button>
						<button class="page-delete-button" onclick={() => workspace.deletePage(pageMeta.id)}>
							x
						</button>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		loading...
	{/if}
	<Resizer side="right" {onresize} />
</aside>

<style lang="scss">
	.sidebar {
		border-radius: 0.5rem;
		width: var(--width, 240px);
		background: var(--color-surface);
		position: relative;
		transition:
			margin 0.2s,
			opacity 0.2s;
		display: flex;
		flex-direction: column;

		&.hidden {
			opacity: 0.5;
			margin-left: calc(var(--width, 240px) * -1 - 0.5rem);
		}
	}

	.section {
		padding: 0.5rem;
		display: flex;
		flex-direction: column;

		.label {
			display: flex;
			justify-content: space-between;
			padding-inline: 0.5rem;

			.label-text {
				font-size: 0.875rem;
				font-weight: 500;
				color: gray;
			}
		}
	}

	.pages {
		display: flex;
		flex-direction: column;

		&.nested {
			padding-left: 1rem;
		}
	}

	.page {
		position: relative;
	}

	.page-button {
		width: 100%;
		background: transparent;
		height: 2rem;
		border: none;
		display: flex;
		border-radius: 0.25rem;
		align-items: center;
		padding-inline: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-foreground);
		// cursor: pointer;

		&:hover {
			background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
		}
	}

	.page-delete-button {
		position: absolute;
		right: 0.25rem;
		top: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		background: none;
		border: none;
		border-radius: 0.25rem;
		
		&:hover {
			background: red;
		}
	}
</style>
