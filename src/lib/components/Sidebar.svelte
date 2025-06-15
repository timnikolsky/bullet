<script lang="ts">
	import { workspaceManager } from '$lib/workspace/WorkspaceManager.svelte';
	import Resizer from './Resizer.svelte';

	const workspace = workspaceManager.currentWorkspace!;

	const minWidth = 200;
	const maxWidth = 600;

	let width = $state(getInitialWidth());
	let hidden = $state(false);

	function onresize(x: number, y: number) {
		hidden = x - 8 < minWidth / 2;
		width = Math.min(Math.max(x - 8, minWidth), maxWidth);
		localStorage.setItem('sidebarWidth', width.toString());
	}

	function getInitialWidth() {
		const savedWidth = localStorage.getItem('sidebarWidth');
		return savedWidth ? parseInt(savedWidth, 10) : 240;
	}
</script>

<aside class="sidebar" class:hidden={hidden} style:--width="{width}px">
	{#each workspace.pages as page}
		<button>{page.name}</button>
	{/each}
	<Resizer side="right" {onresize}/>
</aside>

<style lang="scss">
	.sidebar {
		border-radius: 0.5rem;
		width: var(--width, 240px);
		background: var(--color-surface);
		position: relative;
		transition: margin 0.2s, opacity 0.2s;

		&.hidden {
			opacity: 0.5;
			margin-left: calc(var(--width, 240px) * -1 - 0.5rem);
		}
	}
</style>
