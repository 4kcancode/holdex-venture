<script>
  import { getContext } from 'svelte';

  const { className, ...rest } = $$props;

  let theme = getContext('theme');
</script>

<code
  class="mono text-tw-inline-code-color whitespace-pre-wrap text-sm {className} {$theme}"
  {...rest}
>
  <slot />
</code>

<style lang="sass">
    .dark.inline
        @apply text-tw-inline-code-color

</style>
