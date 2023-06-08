<script>
	import { getContext } from 'svelte';

	const { className, ...rest } = $$props;

	let theme = getContext('theme');
</script>

<blockquote
	class="px-5 py-0 mx-0 my-6 bg-tw-accents-1 text-tw-accents-5 border border-tw-accents-2 {className} {$theme}"
	{...rest}
>
	<slot />
</blockquote>
