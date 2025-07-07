<script lang="ts">
	import Heading from '$lib/core/blocks/Heading.svelte';
	import { SvelteNodeView } from '$lib/components/editor/SvelteNodeView.svelte';
	import Paragraph from '$lib/core/blocks/Paragraph.svelte';
	import type { DocumentPage } from '$lib/core/pages/DocumentPage';
	import type { Workspace } from '$lib/core/workspace/Workspace.svelte';
	import { baseKeymap, chainCommands } from 'prosemirror-commands';
	import { history, redo, undo } from 'prosemirror-history';
	import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
	import { keymap } from 'prosemirror-keymap';
	import { Schema } from 'prosemirror-model';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { onMount } from 'svelte';

	let element: HTMLElement;

	let { page, workspace }: { page: DocumentPage; workspace: Workspace } = $props();
	let content = $state<any>();
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	function saveContent() {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			if (content) {
				workspace.updatePageContent(page.id, JSON.stringify(content));
			}
		}, 1000);
	}

	const schema = new Schema({
		nodes: {
			doc: { content: 'block+' },
			text: { group: 'inline' },
			paragraph: {
				group: 'block',
				content: 'inline*'
			},
			heading: {
				group: 'block',
				content: 'inline*'
			},
			hardBreak: {
				inline: true,
				group: 'inline',
				selectable: false,
				parseDOM: [{ tag: 'br' }],
				toDOM() {
					return ['br'];
				}
			}
		}
	});

	onMount(() => {
		let state = EditorState.create({
			schema,
			plugins: [
				history(),
				keymap({
					'Mod-z': undo,
					'Mod-y': redo,
					'Shift-Enter': chainCommands((state, dispatch) => {
						if (dispatch)
							dispatch(
								state.tr.replaceSelectionWith(schema.nodes.hardBreak.create()).scrollIntoView()
							);
						return true;
					}),
					...baseKeymap
				}),
				inputRules({
					rules: [textblockTypeInputRule(/^(#{1,3})\s$/, schema.nodes.heading)]
				})
			],
			doc: schema.nodeFromJSON(
				page.content
					? {
							type: 'doc',
							content: JSON.parse(page.content)
						}
					: {
							type: 'doc',
							content: [
								{
									type: 'paragraph'
								}
							]
						}
			)
		});

		content = state.toJSON().doc.content;

		let view = new EditorView(element, {
			state,
			dispatchTransaction(transaction) {
				let newState = view.state.apply(transaction);
				view.updateState(newState);
				view.state.selection;
				content = newState.toJSON().doc.content;
				saveContent();
			},
			nodeViews: {
				paragraph: (node, view, getPos) => new SvelteNodeView(node, view, getPos, Paragraph),
				heading: (node, view, getPos) => new SvelteNodeView(node, view, getPos, Heading)
			}
		});
	});
</script>

<div class="editor" bind:this={element} spellcheck="false"></div>

<details>
	<summary style:opacity={0.1} style:margin-top="2rem">Show JSON Content</summary>
	<pre style:font-size="0.75rem" style:font-family="JetBrains Mono">
{JSON.stringify(content, null, 2)}
	</pre>
</details>

<style lang="scss">
	.editor {
		width: 100%;
		outline: none;

		:global(.ProseMirror) {
			display: flex;
			flex-direction: column;

			&:focus-visible {
				outline: none;
			}
		}

		// & > :global(div:focus-visible) {
		// 	outline: none;
		// }
	}
</style>
