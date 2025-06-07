import { Adapter } from '$lib/adapters/Adapter';
import type { Page } from '$lib/types';

export class LocalAdapter extends Adapter {
	
	async createPage(name: string): Promise<Page> {
		return {
			id: '1',
			name
		}
	}
}