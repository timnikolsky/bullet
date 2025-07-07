<script lang="ts">
	import { onMount } from 'svelte';
	const { getCurrentWindow } = window.__TAURI__.window;

	const appWindow = getCurrentWindow();

	let isMaximized = $state(false);

	onMount(async () => {
		isMaximized = await appWindow.isMaximized();

		appWindow.onResized(async () => {
			isMaximized = await appWindow.isMaximized();
		});
	});

	function handleMinimizeClick() {
		appWindow.minimize();
	}

	function handleMaximizeClick() {
		appWindow.toggleMaximize();
	}

	function handleCloseClick() {
		appWindow.close();
	}
</script>

<div class="windows-controls">
	<button class="control-button" id="minimize" onclick={handleMinimizeClick}>
		&#59681;
	</button>
	<button class="control-button" id="maximize" onclick={handleMaximizeClick}>
		{#if isMaximized}
			&#59683;
		{:else}
			&#59682;
		{/if}
	</button>
	<button class="control-button close" id="close" onclick={handleCloseClick}>
		&#59579;
	</button>
</div>

<style lang="scss">
	.windows-controls {
		height: 100%;
		display: flex;
		pointer-events: all;
	}

	.control-button {
		width: 46px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		padding: 0;
		outline: none;
		font-size: 10px;
		font-weight: 300;
		cursor: default;
		box-shadow: none;
		border-radius: 0;
		transition: background 0.05s;
		background: transparent;
		text-rendering: geometricPrecision;
		font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
		color: currentColor;

		&:hover {
			background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
		}

		&:active {
			background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
		}

		&#close:hover {
			background: #c42b1c;
			color: white;
		}

		&#close:active {
			background: #af2819;
			color: white;
		}
	}
</style>
