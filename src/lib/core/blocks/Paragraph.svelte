<script lang="ts">
	import type { Node } from 'prosemirror-model';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		content: Attachment;
		node: Node;
	}

	let { content, node }: Props = $props();
</script>

<div class="paragraph-block">
	<p class="paragraph" {@attach content}></p>
	<!-- {#if node.content.size === 0}
		<span class="empty">Type anything...</span>
	{/if} -->
</div>

<style lang="scss">
	.paragraph-block {
		display: block;
		position: relative;
	}

	.paragraph {
		color: var(--color-foreground);
		margin: 0.25rem 0;
		line-height: 1.5rem;
		min-height: 1.5rem;
		font-size: 1rem;
		display: inline-block;
		width: 100%;
	}

	.empty {
		position: absolute;
		top: 0.25rem;
		left: 0;
		opacity: 0.5;
		pointer-events: none;
		font-size: 1rem;
		line-height: 1.5rem;
		user-select: none;
	}
</style>