<script>
  import { getContext } from 'svelte';
  const { href } = $$props;

  let theme = getContext('theme');
</script>

<a
  class="inline-block no-underline text-tw-tweet-link-color hover:underline exclude {$theme}"
  {href}
  target="_blank"
  rel="noopener noreferrer"
  title={href}
>
  <b class="text-tw-tweet-link-color hover:text-tw-tweet-link-color-hover"><slot /></b>
</a>
