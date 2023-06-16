<script>
  import { getContext } from 'svelte';
  import { beautifyHref } from '../anchor.svelte';

  export let title;
  export let description;
  export let images;
  export let href;
  export let value;
  export let html;

  $: image = images && images[0];

  let theme = getContext('theme');
</script>

<a class="exclude embed-link underline-not {$theme}" {href} target="_blank" rel="nofollow">
  {#if image}
    <span class="embed-link__image" class:relative={html}>
      <img src={image.url} alt="Website" />
    </span>
  {/if}
  <span class="embed-link__content">
    <span class="embed-link__name">{beautifyHref(value)}</span>
    <span class="embed-link__title">{title}</span>
    <span class="embed-link__description">{description}</span>
  </span>
</a>
