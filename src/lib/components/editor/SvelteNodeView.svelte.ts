import Paragraph from '$lib/components/blocks/Paragraph.svelte';
import type { EditorView, NodeView } from 'prosemirror-view';
import { flushSync, mount, unmount } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { Node } from 'prosemirror-model';

export class SvelteNodeView implements NodeView {
	dom: HTMLElement;
	contentDOM?: HTMLElement;
	node: Node;
	component: typeof Paragraph;
	mountedComponent!: ReturnType<typeof mount>;
	props: { node: Node; content: Attachment } = $state({} as { node: Node; content: Attachment });
	getPos: () => number | undefined;
	view: EditorView;

	constructor(
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		component: typeof Paragraph
	) {
		this.component = component;
		this.node = node;
		this.dom = document.createElement('div');
		this.getPos = getPos;
		this.view = view;
		this.contentDOM = document.createElement('div');
		this.props.node = node;
		this.props.content = this.contentAction;
		this.render();
	}

	update(node: Node): boolean {
		if (node.type !== this.node.type) return false;
		this.node = node;
		this.props.node = node;
		return true;
	}

	destroy() {
		unmount(this.mountedComponent);
	}

	render() {
		this.mountedComponent = mount(this.component, {
			target: this.dom,
			props: this.props
		});
		flushSync()
	}

	ignoreMutation(mutation: MutationRecord | { type: 'selection' }) {
		if (mutation.type === 'selection') return false;
		if (!this.contentDOM) return true;

		if (mutation.target === this.contentDOM || mutation.target === this.dom) {
			return false;
		}

		return !this.contentDOM.contains(mutation.target);
	}

	contentAction: Attachment = (element) => {
		if (element && this.contentDOM && !this.contentDOM.parentNode) {
			element.innerHTML = '';
			element.appendChild(this.contentDOM);
		}
	};
}
