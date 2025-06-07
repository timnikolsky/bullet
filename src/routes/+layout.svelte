<script lang="ts">
	import StatusBar from '$lib/components/StatusBar.svelte';
	import Titlebar from '$lib/components/Titlebar.svelte';
	import '../styles/global.scss';
	import Counter from '$lib/components/blocks/Counter.svelte';

	let { children } = $props();

	$effect(() => {

		customElements.define('bullet-counter', Counter.element!);
	})
</script>

<div class="app">
	<Titlebar/>
	<div class="views">
		{@render children()}
	</div>
	<StatusBar/>
</div>

<style lang="scss">
	.app {
		width: 100%;
		height: 100svh;
		display: flex;
		flex-direction: column;
	}

	.views {
		flex: 1;
		display: flex;
		padding: 0 0.5rem;
		gap: 0.5rem;
		position: relative;
	}
</style>
