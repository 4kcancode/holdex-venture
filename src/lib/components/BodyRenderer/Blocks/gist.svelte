<script lang="ts">
  type Item = {
    type: string;
    service: string;
    source: string;
    embed: string;
    caption?: string;
  };
  export let item: Item;

  export let src = '';
  export let title = '';
  src = src.slice(src.length - 3) === '.js' ? src : src + '.js';
  title = title === '' ? src : title;
  import { onMount } from 'svelte';
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
  src="about:blank"
  bind:this={frame}
  {title}
  {height}
  scrolling="no"
  on:load={getInnerHeight}
/>

<style>
  iframe {
    position: relative;
    border: 0;
    width: 710px;
    left: -53px;
  }
  @media screen and (min-width: 320px) and (max-width: 767px) {
    iframe {
      position: relative;
      width: 100%;
      left: 0;
    }
  }
</style>
