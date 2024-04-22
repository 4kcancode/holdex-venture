<script>
  import { getContext } from 'svelte';

  const { className, ...rest } = $$props;

  let theme = getContext('theme');
</script>

<pre
  class="mx-0 my-6 whitespace-pre overflow-auto p-5 text-tw-code-color bg-tw-code-bg-color {className} {$theme}"
  {...rest}><slot /></pre>

<style lang="sass">
    pre
        -webkit-overflow-scrolling: touch
</style>
