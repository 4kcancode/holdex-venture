<script lang="ts">
  export let text: any;
</script>

{#if text}
  {@html text}
{:else}
  <slot />
{/if}
