<script>
	import { getContext } from 'svelte';

	let theme = getContext('theme');

	const { className, ...rest } = $$props;
</script>

<td class="px-3.5 py-2 border border-tw-accents-2 {className} {$theme}" {...rest}>
	<slot />
</td>
