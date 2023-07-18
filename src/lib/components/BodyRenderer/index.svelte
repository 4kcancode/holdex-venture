<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unused-vars */
  import Item from './item.svelte'

  export let blocks: any[];
</script>

{#each blocks as item, index}
  <Item item={item} index={index} />
{/each}

<style lang="sass">
	:global(.heading + ol), 
	:global(.heading + ul),
	:global(.heading + .video-player),
	:global(.heading + p)
		@apply -mt-8 xs:-mt-4
</style>
