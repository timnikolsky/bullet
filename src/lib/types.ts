export interface PageMeta {
	id: number;
	type: string;
	title: string;
	order: number;
	parentId: number | null;
}

export interface Page extends PageMeta {
	content: string;
}
