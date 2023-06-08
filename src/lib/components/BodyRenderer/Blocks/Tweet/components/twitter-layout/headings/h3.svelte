<script>
	import PermaLink from './permalink.svelte';
</script>

<h3 class="heading text-h3-l">
	<PermaLink id={$$props.data.id}>
		<slot />
	</PermaLink>
</h3>
