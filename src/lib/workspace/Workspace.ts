import type { Adapter } from '$lib/adapters/Adapter';
import { LocalAdapter } from '$lib/adapters/LocalAdapter';

export interface WorkspaceOptions {
	/** id */
	id: string;

	/** Name of the workspace */
	name: string;

	/** Adapter for the workspace */
	adapter: string;
}

export class Workspace {
	/** id */
	id: string;

	/** Name of the workspace */
	name: string;

	/** Adapter for the workspace */
	adapter: Adapter;

	constructor(options: WorkspaceOptions) {
		this.id = options.id;
		this.name = options.name;
		this.adapter = new LocalAdapter();
	}
}
