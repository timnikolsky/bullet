<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="panel">
	{@render children()}
</div>

<style lang="scss">
	.panel {
		background: var(--color-surface, #fff);
		flex: 1;
		border-radius: 0.5rem;
	}
</style>
