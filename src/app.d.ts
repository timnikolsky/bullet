import * as app from '@tauri-apps/api';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare global {
	interface Window {
		__TAURI__: typeof app;
	}
}

export {};
