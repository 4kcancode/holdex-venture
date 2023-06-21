<script context="module">
  const PROTOCOL = /^(https?:|)\/\//;

  export const beautifyHref = (href) => {
    const text = href.replace(PROTOCOL, '');
    const i = text.indexOf('/');

    if (i === -1) return text;
    // Remove trailing slash
    if (i === text.length - 1) {
      return text.substring(0, i);
    }

    const hostname = text.substring(0, i);
    const pathname = text.substring(i);

    // Hide large paths similarly to how twitter does it
    return pathname.length > 20 ? `${hostname}${pathname.substring(0, 15)}...` : text;
  };
</script>

<script>
  import { getContext } from 'svelte';

  const { href, title, value } = $$props;

  let theme = getContext('theme');
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  title={title || href}
  class="inline-block no-underline hover:underline exclude text-tw-tweet-link-color {$theme}"
>
  {beautifyHref(value)}
</a>
