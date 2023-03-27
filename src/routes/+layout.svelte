<script>
	const pageTheme = 'dark';
</script>

<div class="app-container overflow-x-hidden" data-theme={pageTheme}>
	<main>
		<slot />
	</main>
</div>

<style lang="scss" src="./layout.scss" global></style>
