<script>
    import { getContext } from 'svelte';
    export let value = undefined;
    export let isDefault = false;

    let condition = getContext('switch-condition');
</script>

{#if $condition == value || isDefault}
    <slot />
{/if}
