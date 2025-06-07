<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { EditorState, Transaction } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { undo, redo, history } from 'prosemirror-history';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { Schema, DOMParser } from 'prosemirror-model';
	import Counter from './blocks/Counter.svelte';

	let editor: Editor | null = $state(null);
	let element: HTMLElement;

	let { value = $bindable() }: { value: string } = $props();
	let json = $state({});

	const schema = new Schema({
		nodes: {
			doc: { content: 'block+ counter block+ counter block+' },
			text: { group: 'inline' },
			paragraph: {
				content: 'inline*',
				group: 'block',
				toDOM() {
					return ['p', 0];
				},
				parseDOM: [{ tag: 'p' }]
			},
			counter: {
				group: 'block',
				toDOM() {
					return ['bullet-counter', '🟊'];
				},
				parseDOM: [{ tag: 'bullet-counter' }]
			}
		}
	});

	function insertCounter(state: EditorState, dispatch?: (tr: Transaction) => void) {
		const type = schema.nodes.counter;
		let { $from: from } = state.selection;
		if (!from.parent.canReplaceWith(from.index(), from.index(), type)) return false;
		dispatch?.(state.tr.replaceSelectionWith(type.create()));
		return true;
	}

	$effect(() => {
		let state = EditorState.create({
			schema,
			plugins: [history(), keymap({ 'Mod-z': undo, 'Mod-y': redo, 'a-l': insertCounter }), keymap(baseKeymap)]
		});

		let view = new EditorView(element, {
			state,
			dispatchTransaction(transaction) {
				let newState = view.state.apply(transaction);
				view.updateState(newState);
				json = view.state.doc.toJSON();
				view.state.selection;
			}
		});
	});
</script>

<div class="editor" bind:this={element} spellcheck="false"></div>

<style lang="scss">
	.editor {
		width: 100%;
		// background: lightblue;
		// color: gray;
		outline: none;

		& > :global(div:focus-visible) {
			outline: none;
		}
	}
</style>
