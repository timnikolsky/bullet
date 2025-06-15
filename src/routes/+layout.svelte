<script lang="ts">
	import StatusBar from '$lib/components/StatusBar.svelte';
	import Titlebar from '$lib/components/Titlebar.svelte';
	import '../styles/global.scss';

	let { children } = $props();
</script>

<div class="app">
	<Titlebar/>
	<div class="layout">
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

	.layout {
		display: flex;
		padding: 0 0.5rem;
		gap: 0.5rem;
		position: relative;
		flex: 1;
		overflow: hidden;
	}
</style>
