<svelte:options customElement="bullet-counter"/>

<script lang="ts">
	let count = $state(0);
</script>

<div class="counter">
	<p>Counter: {count}</p>
	<button onclick={() => count += 1}>Increment</button>
	<button onclick={() => count -= 1}>Decrement</button>
</div>
