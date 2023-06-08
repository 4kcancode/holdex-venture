<script>
	import { getContext } from 'svelte';

	export let style = '';

	let theme = getContext('theme');
</script>

<span
	class="block bg-gradient-to-r from-tw-accents-1 via-tw-accents-2 to-tw-accents-1 w-full bg-[400%_100%] animate-[loading_8s_ease-in-out_infinite] rounded-[5px] {$theme}"
	{style}
>
	<slot />
</span>

<style lang="sass">
    @keyframes loading 
        0%
            background-position: 200% 0
        100%
            background-position: -200% 0
</style>
