<script>
  import { onMount } from 'svelte';

  const { width, height, src, alt_text, html, ...rest } = $$props;

  onMount(async () => {
    await import('@github/details-dialog-element');
  });
</script>

{#if html}
  <div class="absolute block overflow-hidden mt-0 rounded-xl -inset-0">
    <img {...rest} alt={alt_text} src={`${src}`} />
  </div>
{:else}
  <details>
    <summary
      style="padding-bottom: {(height / width) * 100 || 0}%;"
      class="relative box-border w-full list-none cursor-pointer object-cover"
    >
      <div
        class="absolute overflow-hidden -inset-0 rounded-lg box-border p-0 m-auto block w-full object-cover"
      >
        <img {...rest} alt={alt_text} src={`${src}`} />
      </div>
    </summary>

    <details-dialog>
      <div class="bg" data-close-dialog />
      <img {...rest} alt={alt_text} src={`${src}`} {width} {height} />
    </details-dialog>
  </details>
{/if}

<style lang="scss">
  details {
    @apply mt-2.5;
  }
  summary::-webkit-details-marker {
    @apply hidden;
  }
  :global(details-dialog) {
    @apply fixed w-screen h-screen box-border text-center -translate-x-2/4 z-[999] px-6 py-[5vh] left-2/4 top-0;
  }
  details[open] :global(details-dialog > .bg) {
    @apply fixed z-[-1] inset-0;
    background: rgba(0, 0, 0, 0.3);
  }
  @media screen and (max-width: 450px) {
    :global(details-dialog) {
      @apply px-4 py-[5vh];
    }
  }
</style>
