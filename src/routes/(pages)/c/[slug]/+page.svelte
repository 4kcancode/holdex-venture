<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Parser from '$components/BodyParser';
	import {
		feedEmptyIcon,
		HandThumbUp,
		ChatBubbleLeftEllipsis,
		Bolt,
		XMark,
		InformationCircle,
		BookOpen,
		UserGroup
	} from '$components/Icons';
	import MetaTags from '$components/MetaTags/index.svelte';
	import Hashtag from '$components/Hashtag/index.svelte';
	import Icon from '$components/Icons/index.svelte';

	import DefaultFeedItem from '$components/Feed/Item/index.svelte';
	import Feed from '$components/Feed/index.svelte';

	import { timeFormat, extendedTimeFormat } from '$components/DateManager';
	import { formatNumber } from '$components/NumbersManager';
	import { routes } from '$lib/config';
	import { parseQueryFilter } from '../util';
	import { parseCommunityCoverImage, sanitizeHtml } from '$lib/utils';

	import type { Community, Hashtag as HashtagType, HashtagsConnectionEdge, Message } from '$lib/types/api';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ store, options: queryOptions } = data);
	$: ({ data: storeData } = $store);
	$: community = storeData?.community as Community;
	$: communityCover = parseCommunityCoverImage(community);
	$: ({ edges, totalCount, pageInfo } = community?.postedMessages || {
		edges: [],
		totalCount: 0,
		pageInfo: null
	});
	$: pageFilter = getPageFilter($page.url);
	$: pageQ = getPageQ($page.url);
	$: isSearchMode = checkSearchMode($page.url);

	let parseMessage = (message: Message, category: string) => {
		return Parser.parseViaCategory(message, category);
	};

	let getPageFilter = (url: URL) => {
		const filter = url.searchParams.get('filter');
		return filter;
	};

	let getPageQ = (url: URL) => {
		const q = url.searchParams.get('q');
		return q;
	};

	let checkSearchMode = (url: URL) => {
		const q = url.searchParams.get('q');
		const filter = url.searchParams.get('filter');

		return q || (filter && !['CREATED_AT', 'NET_UP_VOTES'].includes(filter));
	};

	let sortHashtags = (s: HashtagsConnectionEdge[]) => {
		let values = s
			.filter((a) => (a.node as HashtagType).postedMessagesTotalCount > 1)
			.slice(0)
			.sort(
				(a, b) =>
					(b.node as HashtagType).postedMessagesTotalCount -
					(a.node as HashtagType).postedMessagesTotalCount
			);

		return values;
	};

	let isHashtagActive = (filter: string, tag: string) => {
		if (!filter) return '';
		return filter.toLowerCase() === tag.toLowerCase()
			? '!text-t1 !bg-l3 before:!border-accent1-default !shadow-tag-active'
			: '';
	};

	let handleSort = (url: URL, filter: string) => {
		const newUrl = url;

		newUrl.searchParams.delete('q');
		newUrl.searchParams.set('filter', filter);
		return goto(newUrl, { invalidateAll: true });
	};

	let isRefetching = false;
	let loadMore = async (afterCursor?: string) => {
		isRefetching = true;
		await store.fetchMore({
			variables: {
				feedInput: {
					...queryOptions.feedInput,
					pageInfo: {
						...queryOptions.feedInput.pageInfo,
						afterCursor
					}
				}
			}
		});
		isRefetching = false;
	};
</script>

<MetaTags
	title="{community.tagline} | Holdex"
	description={sanitizeHtml(community.tagline)}
	path={routes.category(community.slug)}
	imageUrl={communityCover}
	pageName={community.name}
/>

<template lang="pug" src="./template.pug">

</template>
