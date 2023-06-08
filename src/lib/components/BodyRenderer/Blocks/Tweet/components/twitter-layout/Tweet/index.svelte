<script>
	import TweetHeader from './TweetHeader.svelte';
	import TweetInfo from './TweetInfo.svelte';
	import TweetAction from './TweetAction.svelte';
	import { getContext } from 'svelte';

	const { data, className } = $$props;

	let theme = getContext('theme');
</script>

<div
	class="tweet border border-tw-tweet-border text-tw-tweet-font-color bg-tw-tweet-bg-color mx-0 my-6 overflow-hidden rounded-[5px] text-inter text-lg hover:border-tw-tweet-border-hover transition-[border-color] duration-[0.3s] ease-[ease-in-out] {className} {$theme}"
>
	<blockquote class="relative pt-5 pb-2.5 px-5">
		<TweetHeader tweet={data} />
		<slot />
		<TweetInfo tweet={data} />
	</blockquote>

	<TweetAction tweet={data} />
</div>

<style lang="sass">
    
    .tweet :global(.icon)
        @apply inline-block h-[1.25em]
</style>
