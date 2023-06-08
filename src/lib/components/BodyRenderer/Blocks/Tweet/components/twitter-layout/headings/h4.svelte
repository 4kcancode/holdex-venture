<script>
	import PermaLink from './permalink.svelte';
</script>

<h4 class="heading text-h4-l">
	<PermaLink id={$$props.data.id}>
		<slot />
	</PermaLink>
</h4>
