<footer class="status-bar">
	<div class="items left">
		<button class="item">
			Stable connection
		</button>
	</div>
	<div class="items right">
		<button class="item">
			5 words
		</button>
	</div>
</footer>

<style lang="scss">
	.status-bar {
		height: 2rem;
		display: flex;
		justify-content: space-between;
		font-family: 12px;
		padding-inline: 8px;
		flex-shrink: 0;
	}
	
	.items {
		display: flex;
	}

	.item {
		background: none;
		border: none;
		font-family: inherit;
		padding-inline: 6px;
		color: #00000080;
		display: flex;
		align-items: center;

		&:hover {
			background: hsl(16deg 5.51% 24.9% / 8%);
		}
	}
</style>
