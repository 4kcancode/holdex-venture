<script lang="ts">
  import { onMount } from 'svelte';
  type Item = {
    type: string;
    service: string;
    source: string;
    embed: string;
    caption?: string;
  };
  export let item: Item;

  export let title = '';
  title = 'Gist';

  let frame: any;
  let height = '30px';
  const barGistHeight = 30;
  onMount(() => {
    frame.srcdoc = `<script src='${item.embed}.js'><${''}/script>`;
  });
  function getInnerHeight() {
    height = frame?.contentWindow?.document?.body?.scrollHeight + barGistHeight + 'px';
  }
</script>

<iframe
  class="gist filter-none dark:invert"
  src="about:blank"
  bind:this={frame}
  {title}
  {height}
  scrolling="no"
  on:load={getInnerHeight}
  loading="eager"
/>

<style>
  iframe.gist {
    position: relative;
    border: 0;
    width: 710px;
    left: -53px;
  }

  @media screen and (min-width: 320px) and (max-width: 767px) {
    iframe.gist {
      position: relative;
      width: 99.8%;
      left: 0;
      align-self: stretch;
    }
  }
</style>
