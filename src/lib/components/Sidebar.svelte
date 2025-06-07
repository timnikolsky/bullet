<script lang="ts">
	import Resizer from './Resizer.svelte';

	const minWidth = 200;
	const maxWidth = 600;

	let width = $state(getInitialWidth());
	let hidden = $state(false);

	function onresize(x: number, y: number) {
		hidden = x - 8 < minWidth / 2;
		width = Math.min(Math.max(x - 8, minWidth), maxWidth);
		localStorage.setItem('sidebarWidth', width.toString());
	}

	function getInitialWidth() {
		const savedWidth = localStorage.getItem('sidebarWidth');
		return savedWidth ? parseInt(savedWidth, 10) : 240;
	}

	function openSettings() {
		// Logic to open settings modal or page
		alert('Open settings');
	}
</script>

<aside class="sidebar" class:hidden={hidden} style:--width="{width}px">
	<button onclick={openSettings}>
		Settings
	</button>
	<Resizer side="right" {onresize}/>
</aside>

<style lang="scss">
	.sidebar {
		border-radius: 0.5rem;
		width: var(--width, 240px);
		background: var(--color-surface);
		position: relative;
		transition: margin 0.2s, opacity 0.2s;

		&.hidden {
			opacity: 0.5;
			margin-left: calc(var(--width, 240px) * -1 - 0.5rem);
		}
	}

	.items {
		display: flex;
		flex-direction: column;
	}

	.items-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.items-group-title {
		font-size: 13px;
		font-weight: 500;
		color: #231917;
	}

	.item {
		height: 30px;
		display: flex;
		padding: 1px;

		.item-inner {
			display: flex;
			align-items: center;
			padding-inline: 8px;
			gap: 8px;
			color: #231917;
			// color: #222222;
			border-radius: 5px;
			flex: 1;
		}

		.item-text {
			font-size: 14px;
			line-height: 20px;
			font-weight: 400;
		}

		&:hover .item-inner {
			background: #fff1ed;
		}

		&.active .item-inner {
			background: #ffdbd0;
			color: #723521;
			// color: white;
		}
	}
</style>
