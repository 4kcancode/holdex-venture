<script>
	import PermaLink from './permalink.svelte';
</script>

<h2 class="heading text-h2-l">
	<PermaLink id={$$props.data.id}>
		<slot />
	</PermaLink>
</h2>
