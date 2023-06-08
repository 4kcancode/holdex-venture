<script>
	import PermaLink from './permalink.svelte';
</script>

<h1 class="heading text-h1-l">
	<PermaLink id={$$props.data.id}>
		<slot />
	</PermaLink>
</h1>
