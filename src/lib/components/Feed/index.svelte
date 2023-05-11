<script lang="ts">
	import Parser from '$components/BodyParser';

	import DefaultFeedItem from '$components/Feed/Item/index.svelte';
	import PortfolioFeedItem from '$components/Feed/PortfolioItem/index.svelte';
	import JobsFeedItem from '$components/Feed/JobsItem/index.svelte';

	import type {
		Message,
		PostedMessagesConnectionEdge,
		CommunityPostedMessagesConnectionEdge,
		PageInfo
	} from '$lib/types/api';
	import Button from '$components/Button/index.svelte';

	type FeedType = 'default' | 'portfolio' | 'jobs';

	export let feedType: FeedType = 'default';

	export let edges: PostedMessagesConnectionEdge[] | CommunityPostedMessagesConnectionEdge[];
	export let totalCount: number;
	export let pageInfo: PageInfo;
	export let isRefetching: boolean;
	export let loadMore: () => void;

	let parseMessage = (message: Message, category: string) => {
		return Parser.parseViaCategory(message, category);
	};
</script>

<template lang="pug" src="./template.pug">

</template>
