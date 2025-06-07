<script lang="ts">
	interface Props {
		side: 'left' | 'right' | 'top' | 'bottom';
		onresize?: (newX: number, newY: number) => void;
	}

	let { side, onresize }: Props = $props();

	let isResizing = $state(false);
	let cursorType = $derived(['left', 'right'].includes(side) ? 'ew-resize' : 'ns-resize');
	let startX: number;
	let startY: number;

	function handleMouseDown(event: MouseEvent) {
		event.preventDefault();
		isResizing = true;
		document.body.style.cursor = cursorType;
		document.body.style.userSelect = 'none';
		document.body.style.touchAction = 'none';
		startX = event.clientX;
		startY = event.clientY;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isResizing) return;
		onresize?.(event.clientX, event.clientY);
	}

	function handleMouseUp(event: MouseEvent) {
		if (!isResizing) return;
		isResizing = false;
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
		document.body.style.touchAction = '';
		
		onresize?.(event.clientX, event.clientY);
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="separator"
	aria-label="Resizer"
	class="resizer {side}"
	class:active={isResizing}
	onmousedown={handleMouseDown}
	tabindex="-1"
></div>

<style lang="scss">
	.resizer {
		--highlight-color: #bacb7c;
		position: absolute;
		transition: 0.2s ease-in-out;

		&:hover:not(.active) {
			background-image: linear-gradient(
				to top,
				transparent 0%,
				color-mix(in srgb, var(--highlight-color), transparent) 50%,
				transparent 100%
			);
		}

		&.active {
			background-image: linear-gradient(
				to top,
				transparent 0%,
				var(--highlight-color) 50%,
				transparent 100%
			);
		}

		&.left,
		&.right {
			width: 0.5rem;
			height: 100%;
			top: 0;
			cursor: ew-resize;
			background-position: 3px;
			background-size: 2px 100%;
			background-repeat: no-repeat;
		}

		&.left {
			left: -0.5rem;
		}

		&.right {
			right: -0.5rem;
		}
	}
</style>
