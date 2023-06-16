<script lang="ts">
  export let id;
</script>

<template>
  <span {id} class="block absolute invisible mt-[calc(-1_*_3.5rem)] pt-14" />
  <a
    href={`#${id}`}
    class="hover: ~.permalink: visible text-inherit no-underline hover:text-inherit hover:transition-[color] hover:duration-[0.3s] hover:ease-[ease-in-out] hover:border-b hover:border-solid hoover:"
  >
    <slot />
  </a>
  <span class="permalink invisible hidden font-medium">#</span>
</template>

<style lang="sass">
	@media screen and (min-width: 992px)
		a 
			@apply mr-2
		.permalink 
			@apply inline-block

</style>
