<script lang="ts">
	import WindowsControls from '$lib/components/WindowsControls.svelte';
	import { platform } from '@tauri-apps/plugin-os';

	const currentPlatform = '__TAURI__' in window ? platform() : 'web';
</script>

<div class="titlebar" data-tauri-drag-region>
	<div class="left titlebar-section">
		{#if currentPlatform !== 'macos'}
			<svg class="app-icon" width="16" height="16">
				<circle cx="2" cy="2" r="2" fill="currentColor" />
				<circle cx="2" cy="14" r="2" fill="currentColor" />
				<circle cx="14" cy="2" r="2" fill="currentColor" />
				<circle cx="14" cy="14" r="2" fill="currentColor" />
			</svg>
			<span>Bullet</span>
		{/if}
	</div>
	<div class="center titlebar-section">Bullet</div>
	<div class="right titlebar-section">
		{#if currentPlatform === 'windows'}
			<WindowsControls />
		{/if}
	</div>
</div>

<style lang="scss">
	.titlebar {
		height: var(--titlebar-height);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		width: 100%;
		font-size: 12px;
		font-weight: 400;
		flex-shrink: 0;
	}

	.titlebar-section {
		display: flex;
		align-items: center;
		pointer-events: none;
	}

	.left {
		display: flex;

		.app-icon {
			display: flex;
			margin-inline: 0.5rem;
			color: var(--color-foreground);
		}

		.macos-controls-box {
			height: 0.75rem;
			margin: 0.75rem;
			display: flex;
			gap: 0.5rem;

			button {
				height: 0.75rem;
				width: 0.75rem;
				border-radius: 50%;
				border: none;
				color: transparent;

				&:nth-child(1) {
					background-color: #fa625c; /* close */
				}

				&:nth-child(2) {
					background-color: #fbb43a; /* minimize */
				}

				&:nth-child(3) {
					background-color: #25c83a; /* maximize */
				}
			}
		}
	}

	.right {
		justify-content: flex-end;
	}

	:global([data-tauri-decorum-tb]) {
		align-items: center !important;
		height: var(--titlebar-height) !important;
		right: 0 !important;
		left: unset !important;
		top: 0 !important;
	}

	:global(.decorum-tb-btn) {
		height: var(--titlebar-height) !important;
		color: var(--color-foreground);
		width: 45px;
	}

	:global(#decorum-tb-close):hover {
		background: #c42b1c !important;
		color: white !important;
	}
</style>
