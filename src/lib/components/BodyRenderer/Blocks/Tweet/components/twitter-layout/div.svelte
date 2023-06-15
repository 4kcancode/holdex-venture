<div dir="auto" class={$$props.className}>
  <slot />
</div>

<style lang="sass">

    .image-container 
        @apply grid grid-cols-[repeat(auto-fit,minmax(50%,1fr))] mx-0 my-6
        
    .image-count-3 > :global(:first-child)
        @apply row-end-[span_2]
        
    .gif-container,
    .video-container
        @apply mx-0 my-6
    
    .gif-container > :global(video),
    .video-container > :global(video)  
        @apply w-full max-h-[500px]

    .content-container
        @apply whitespace-pre-wrap mx-0 my-5
        word-wrap: break-word

</style>
