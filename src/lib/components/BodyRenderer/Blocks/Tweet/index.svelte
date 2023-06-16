<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Node from './components/html/node.svelte';
  import components from './components/twitter-layout';

  export let ast;
  export let skeleton;
  export let theme = 'dark';
  export let html = false;

  const TweetSkeleton = components.TweetSkeleton;

  let themeStyle = writable(theme);
  $: $themeStyle = theme;

  setContext('theme', themeStyle);
</script>

<div class="flex flex-col w-full max-w-none shadow-md shadow-neutral-700">
  {#if skeleton}
    <TweetSkeleton />
  {:else}
    <Node {components} node={ast} {html} />
  {/if}
</div>

<style lang="scss">
</style>
