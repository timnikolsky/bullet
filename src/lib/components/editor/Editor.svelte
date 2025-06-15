<script lang="ts">
	import Paragraph from '$lib/components/blocks/Paragraph.svelte';
	import { SvelteNodeView } from '$lib/components/editor/SvelteNodeView.svelte';
	import { baseKeymap } from 'prosemirror-commands';
	import { history, redo, undo } from 'prosemirror-history';
	import { keymap } from 'prosemirror-keymap';
	import { Schema } from 'prosemirror-model';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';

	let element: HTMLElement;

	let { value = $bindable() }: { value: string } = $props();
	let json = $state<any>();

	const schema = new Schema({
		nodes: {
			doc: { content: 'block+' },
			text: { group: 'inline' },
			paragraph: {
				content: 'inline*',
				group: 'block',
				toDOM: (node) => ['p', 0],
				parseDOM: [{ tag: 'p' }]
			}
		}
	});

	$effect(() => {
		let state = EditorState.create({
			schema,
			plugins: [history(), keymap({ 'Mod-z': undo, 'Mod-y': redo }), keymap(baseKeymap)]
		});

		json = state.toJSON();

		let view = new EditorView(element, {
			state,
			dispatchTransaction(transaction) {
				let newState = view.state.apply(transaction);
				view.updateState(newState);
				view.state.selection;
				json = newState.toJSON();
			},
			nodeViews: {
				paragraph: (node, view, getPos) => new SvelteNodeView(node, view, getPos, Paragraph)
			}
		});
	});
</script>

<div class="editor" bind:this={element} spellcheck="false"></div>
<pre style:font-size="0.75rem" style:font-family="JetBrains Mono">
{JSON.stringify(json?.doc!.content, null, 2)}
</pre>

<style lang="scss">
	.editor {
		width: 100%;
		outline: none;

		:global(.ProseMirror) {
			display: flex;
			flex-direction: column;
		}

		& > :global(div:focus-visible) {
			outline: none;
		}
	}
</style>
