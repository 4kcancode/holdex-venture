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
    frame.addEventListener('load', (ev) => {
      const new_style_element = document.createElement('style');

      if (localStorage.getItem('theme') === 'dark') {
        new_style_element.textContent =
          'body { margin: 0; }' +
          'body::-webkit-scrollbar { width: 4px; }' +
          'body::-webkit-scrollbar-thumb { background-color: white; }' +
          '.gist .gist-file { border: 1px solid #2F323D; }' +
          '.gist .gist-data { background-color: #1C1F29 !important; border-bottom: 1px solid #2F323D; }' +
          '.gist .gist-meta { background-color: #252933; color: #D7DAE0; }' +
          '.gist .gist-meta a { color: #D7DAE0 }' +
          '.gist .blob-num { background: #1C1F29; }' +
          '.gist .highlight { background: #1C1F29; }' +
          '.gist .blob-code-inner { color: #FFF }' +
          '.gist .pl-en { color: #fff; }' +
          '.gist .pl-ent, .gist .pl-v { color: #fd0; }' +
          '.gist .pl-mh, .gist .pl-mh .pl-en, .gist .pl-sr .pl-cce { color: #eb939a; }' +
          '.gist .pl-pds, .gist .pl-s, .gist .pl-s1, .gist .pl-s1 .pl-pse .pl-s2, .gist .pl-s1 .pl-v { color: #3ad900; }' +
          '.gist .pl-s1 .pl-s2, .gist .pl-smi, .gist .pl-smp, .gist .pl-stj, .gist .pl-vo, .gist .pl-vpf { color: #ccc; }' +
          '.gist .pl-s3, .gist .pl-sc { color: #ffb054; }' +
          '.gist .pl-sr, .gist .pl-sr .pl-sra, .gist .pl-sr .pl-sre, .gist .pl-src { color: #80ffc2; }' +
          '.gist .pl-mdht, .gist .pl-mi1 { color: #f8f8f8; background: rgba(0, 64, 0, .5); }' +
          '.gist .pl-id, .gist .pl-ii, .gist .pl-md, .gist .pl-mdhf { color: #f8f8f8; background: #800f00; }' +
          '.gist .highlight-source-js .pl-st { color: #ffee80; }' +
          '.gist .highlight-source-css .pl-s3 { color: #80ffbb; }' +
          '.gist .highlight-text-html-basic .pl-ent { color: #9effff; }' +
          '.gist .pl-c, .gist .pl-c span, .gist .pl-mq { color: #08f; }' +
          '.gist .pl-c1, .gist .pl-sv, .gist .pl-mb { color: #ff628c; }' +
          '.gist .pl-e, .gist .pl-k, .gist .pl-mdh, .gist .pl-mdr, .gist .pl-ml, .gist .pl-mm, .gist .pl-mo, .gist .pl-mp, .gist .pl-mr, .gist .pl-ms, .gist .pl-st, .gist .pl-mi { color: #ff9d00; }';
      }

      ev.target.contentDocument.head.appendChild(new_style_element);
    });
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
