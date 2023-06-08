<script>
	import PermaLink from './permalink.svelte';
</script>

<h6 class="heading text-h6-l">
	<PermaLink id={$$props.data.id}>
		<slot />
	</PermaLink>
</h6>
