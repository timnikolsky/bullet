export interface PluginOptions {
	/** id */
	id: string;
}

export class Plugin {
	id: string;

	constructor(options: PluginOptions) {
		this.id = options.id;
	}
}
