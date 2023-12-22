<script lang="ts">
  import type { CTAElement } from '$components/BodyParser/blocks';
  import Button from '$components/Button/index.svelte';
  /* eslint-disable @typescript-eslint/no-unused-vars */

  export let item: CTAElement;
</script>

<div
  class="relative cta flex flex-row xs:flex-col xs:gap-6 gap-4 w-full border border-solid border-l4 rounded-xl p-4 bg-l1 dark:bg-l2"
>
  <div class="flex flex-col xs:w-full">
    {#if item.title}
      <p class="text-paragraph-l text-t1 font-bold">{item.title}</p>
    {/if}

    {#if item.description}
      <p class="text-paragraph-l text-t3">{item.description}</p>
    {/if}
  </div>

  <div class="ml-auto flex flex-row gap-4 xs:gap-2 xs:flex-col xs:w-full my-auto">
    {#if item.link1}
      <Button
        class="text-t1"
        variant="primary"
        size="large"
        href={item.link1.url}
        label={item.link1.text}
      />
    {/if}

    {#if item.link2}
      <Button
        class="text-t1"
        variant="secondary"
        size="large"
        href={item.link2.url}
        label={item.link2.text}
      />
    {/if}
  </div>
</div>

<style lang="sass">

</style>
