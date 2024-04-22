<script>
  import { getContext } from 'svelte';
  export let style = '';
  let theme = getContext('theme');
</script>

<span class="block {$theme}" {style}>
  <slot />
</span>

<style lang="sass">
    @keyframes loading 
        0%
            background-position: 200% 0
        100%
            background-position: -200% 0
</style>
