<script lang="ts">
  import type { TestimonialElement } from '$components/BodyParser/blocks';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  /* eslint-disable @typescript-eslint/no-unused-vars */

  export let item: TestimonialElement;

  let themeContext: Writable<string> = getContext('theme');
</script>

<div
  class={'border-decoration relative flex-col justify-start items-stretch w-full border border-solid border-l4 rounded-xl bg-l1 dark:bg-l2 border-decoration-' +
    $themeContext}
>
  <div class="flex flex-row border-b border-solid border-l4 p-4">
    <div class="flex items-center">
      {#if item.picture}
        <img class="w-12 h-12 rounded-full object-cover object-center" src={item.picture.url} />
      {/if}
    </div>
    <div class="flex flex-col xs:w-full ml-4">
      {#if item.name}
        <p class="text-paragraph-l text-t1 font-bold">{item.name}</p>
      {/if}

      {#if item.title}
        <p class="text-paragraph-l text-t3">{item.title}</p>
      {/if}
    </div>
  </div>
  <div class="flex flex-col xs:w-full p-4">
    {#if item.content}
      <p class="text-paragraph-l text-t2">{item.content}</p>
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
.avatar 
    background-size: 48px
    width: 48px
    height: 48px

</style>
