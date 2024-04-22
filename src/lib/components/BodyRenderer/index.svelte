<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import Item from './item.svelte';

  export let blocks: any[];

  let allBlocks: any[] = blocks.slice(1, blocks.length);
</script>


  <Item {item} {index} />
{/each}

<style lang="sass">
	:global(.heading + ol), 
	:global(.heading + ul),
	:global(.heading + .video-player),
	:global(.heading + p)
		@apply -mt-8 xs:-mt-4
</style>
