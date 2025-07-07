<script lang="ts">
	import type { Node } from 'prosemirror-model';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		content: Attachment;
		node: Node;
	}

	let { content, node }: Props = $props();
</script>

<div class="heading-block">
	<!-- svelte-ignore a11y_missing_content -->
	<h2 class="heading" {@attach content}></h2>
	<!-- {#if node.content.size === 0}
		<span class="empty">Type your heading...</span>
	{/if} -->
</div>

<style lang="scss">
	.heading-block {
		display: block;
		position: relative;
	}

	.heading {
		color: var(--color-foreground);
		margin: 0.25rem 0;
		min-height: 1.5rem;
		display: inline-block;
		width: 100%;
		font-size: 1.5rem;
		line-height: 2rem;
		font-family: var(--font-family-heading);
	}

	.empty {
		position: absolute;
		top: 0.25rem;
		left: 0;
		opacity: 0.5;
		pointer-events: none;
		font-size: 1.5rem;
		line-height: 2rem;
		font-family: var(--font-family-heading);
		user-select: none;
	}
</style>