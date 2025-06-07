import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern',
			}
		}
	}
});
