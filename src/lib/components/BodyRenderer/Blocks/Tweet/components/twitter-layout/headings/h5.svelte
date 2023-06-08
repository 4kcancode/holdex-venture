<script>
	import PermaLink from './permalink.svelte';
</script>

<h5 class="text-h5-l">
	<PermaLink id={$$props.data.id}>
		<slot />
	</PermaLink>
</h5>
