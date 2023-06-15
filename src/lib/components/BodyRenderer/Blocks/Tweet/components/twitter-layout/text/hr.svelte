<script>
  import { getContext } from 'svelte';

  const { className, ...rest } = $$props;

  let theme = getContext('theme');
</script>

<hr class="border-t border-tw-accents-2 mx-0 my-6 {className} {$theme}" {...rest} />
