<script>
	import { getContext } from 'svelte';

	import Skeleton from '../skeleton/index.svelte';

	let theme = getContext('theme');
</script>

<div class="container rounded-[5px] bg-tw-tweet-bg-color border border-tw-tweet-border ${theme}">
	<Skeleton>
		<div class="flex justify-between p-4 border-tw-tweet-border">
			<div class="flex justify-between mt-2">
				<span class="avatar animation animate mr-2.5 exclude ${theme}" />
				<span
					class="flex flex-col no-underline transition-[color] duration-[0.3s] ease-[ease-in-out] exclude {$theme}"
				>
					<span class="author animation animate overflow-hidden ${theme}" title="name" />
					<span class="username animation animate overflow-hidden ${theme}" title="username" />
				</span>
			</div>
			<img
				class="icon w-[1.25em] h-[1.25em] object-contain twicon brand exclude"
				title="View on Twitter"
				alt="twitter"
				src="/tweet/twitter.png"
			/>
		</div>
	</Skeleton>
	<Skeleton>
		<div class="content animation animate" />
	</Skeleton>
	<hr class="text-tw-tweet-border" />
	<Skeleton style="margin: 1.25rem 0">
		<div class="mt-2 action animation animate ${theme}" />
	</Skeleton>
</div>

<style lang="sass">
		.avatar
			@apply w-10 h-10 rounded-[50%] border border-tw-tweet-avatar-border bg-tw-tweet-btn-border  
			& > img
				@apply rounded-[50%] border border-tw-tweet-avatar-border w-36  

		.author
			@apply w-48 h-6 bg-tw-tweet-border text-tw-tweet-border border-b border-tw-tweet-bg-color rounded-md

		.username
			@apply w-24 h-6 bg-tw-tweet-border text-tw-tweet-border border-b border-tw-tweet-bg-color  rounded-md

		.brand
			@apply ml-auto

		.twicon
			filter: saturate(0)

		.header
			@apply p-4 border border-tw-tweet-border 

		.content
			@apply border border-tw-tweet-border rounded h-32 m-8

		.action
			@apply border border-tw-tweet-border rounded h-8 m-8 mt-2 rounded-[999px]

		.animation
			@apply bg-gradient-to-r from-tw-tweet-bg-color via-tw-tweet-border to-tw-tweet-bg-color bg-[400%_100%]

		.animate
			background-size: 400%
			-webkit-animation: loading 8s ease infinite
			-moz-animation: loading 8s ease infinite
			animation: loading 8s ease infinite


		@keyframes loading
			0%
				background-position: 200% 0
			100%
				background-position: -200% 0
</style>
