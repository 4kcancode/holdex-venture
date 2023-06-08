<script>
	import { getContext } from 'svelte';

	const { className, ...rest } = $$props;

	let theme = getContext('theme');
</script>

<ul class="list-none pl-4 text-[1.25rem_0] {className} {$theme}" {...rest}>
	<slot />
</ul>

<style lang="sass">
    ul :global(li:before)
        @apply content-["-"] absolute ml-[-1rem] text-tw-accents-3
                
    .dark :global(li:before)
        @apply text-tw-accents-3

</style>
