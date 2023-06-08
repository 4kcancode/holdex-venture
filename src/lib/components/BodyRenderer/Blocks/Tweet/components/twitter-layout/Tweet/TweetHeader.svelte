<script>
	import { getContext } from 'svelte';

	export let tweet;

	const theme = getContext('theme');

	$: ({ author_id, users } = tweet);

	$: authorInfo = users.find((u) => u.id === author_id);
	$: url = `https://twitter.com/${authorInfo.username}`;

	const twitterSrc = 'https://storage.googleapis.com/stage-holdex-public/assets/twitter.png';
</script>

<div class="flex">
	<a
		href={url}
		class="avatar @apply h-9 w-9 mr-2.5 exclude {$theme}"
		target="_blank"
		rel="noopener noreferrer"
	>
		<img src={authorInfo.profile_image_url} alt={authorInfo.name} width={36} height={36} />
	</a>
	<a
		href={url}
		class="author no-underline text-inherit transition-[color] duration-[0.3s] ease-[ease-in-out] exclude {$theme}"
		target="_blank"
		rel="noopener noreferrer"
	>
		<span
			class="table font-bold leading-[1.2] text-ellipsis whitespace-nowrap overflow-hidden text-tw-tweet-color-gray"
			title={authorInfo.name}
		>
			{authorInfo.name}
		</span>
		<span
			class="table username leading-[1.2] text-ellipsis whitespace-nowrap overflow-hidden text-tw-tweet-color-gray {$theme}"
			title={`@${authorInfo.username}`}
		>
			@{authorInfo.username}
		</span>
	</a>
	<a href={url} class="brand exclude" target="_blank" rel="noopener noreferrer">
		<img
			class="icon w-[1.25em] h-[1.25em] object-contain twicon"
			title="View on Twitter"
			alt="twitter"
			src={twitterSrc}
		/>
	</a>
</div>

<style lang="sass">
    .avatar
        & > img
            @apply rounded-[50%] border border-tw-tweet-avatar-border 
            
    .author
        &:hover
            @apply text-tw-tweet-link-color-hover 

    .username
        font-size: 0.875rem

    .brand
        @apply ml-auto
    
    .twicon
        filter: saturate(0)

</style>
