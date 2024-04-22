<script lang="ts">
  import type { CTAElement } from '$components/BodyParser/blocks';
  import Button from '$components/Button/index.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  /* eslint-disable @typescript-eslint/no-unused-vars */

  export let item: CTAElement;

  let themeContext: Writable<string> = getContext('theme');
</script>

<div
  class="border-decoration relative justify-start items-stretch cta flex flex-row xs:flex-col xs:gap-6 gap-4 w-full border border-solid border-l4 rounded-xl p-4 bg-l1 dark:bg-l2 border-decoration-{$themeContext}"
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
        target="_blank"
        rel="noopener"
        href={item.link1.url}
        label={item.link1.text}
      />
    {/if}

    {#if item.link2}
      <Button
        class="text-t1"
        variant="secondary"
        size="large"
        target="_blank"
        rel="noopener"
        href={item.link2.url}
        label={item.link2.text}
      />
    {/if}
  </div>
</div>

<style lang="sass">
.border-decoration
  &:before
    content: ""
    position: absolute
    top: -1px
    left: 10%
    width: 200px
    height: 1px
    background-repeat: no-repeat
    @media screen and (max-width: 450px)
      left: 5%
  &:after
    content: ""
    position: absolute
    bottom: -1px
    right: 10%
    width: 200px
    height: 1px
    background-repeat: no-repeat
    @media screen and (max-width: 450px)
      right: 5%
.border-decoration-dark
  &:before
    background: linear-gradient(90deg, rgba(47, 50, 61, 0.00) 0.5%, rgba(0, 204, 255, 0.25) 25.56%, #0CF 50.63%, rgba(0, 204, 255, 0.25) 75.69%, rgba(47, 50, 61, 0.00) 100.75%) 
  &:after
    background: linear-gradient(90deg, rgba(47, 50, 61, 0.00) 0.5%, rgba(0, 204, 255, 0.25) 25.56%, #0CF 50.63%, rgba(0, 204, 255, 0.25) 75.69%, rgba(47, 50, 61, 0.00) 100.75%) 
.border-decoration-light
  &:before
    background: linear-gradient(90deg, rgba(47, 50, 61, 0) 0.5%, rgba(46, 131, 229, 0.25) 25.56%, #2E83E5 50.63%, rgba(46, 131, 229, 0.25) 75.69%, rgba(47, 50, 61, 0) 100.75%)      
  &:after
    background: linear-gradient(90deg, rgba(47, 50, 61, 0) 0.5%, rgba(46, 131, 229, 0.25) 25.56%, #2E83E5 50.63%, rgba(46, 131, 229, 0.25) 75.69%, rgba(47, 50, 61, 0) 100.75%)
</style>
