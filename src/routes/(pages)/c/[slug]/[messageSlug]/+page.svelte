<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import Parser from '$components/BodyParser';
	import BodyRenderer from '$components/BodyRenderer/index.svelte';
	import Icon from '$components/Icons/index.svelte';
	import MetaTags from '$components/MetaTags/index.svelte';
	import TextParagraph from '$components/TextParagraph/index.svelte';
	import Button from '$components/Button/index.svelte';

	import { timeFormat, extendedTimeFormat } from '$components/DateManager';
	import { formatNumber } from '$components/NumbersManager';
	import { BarsArrowDown, BarsArrowUp, Eye, ChatBubbleLeftEllipsis } from '$components/Icons';
	import { routes } from '$lib/config';
	import { parseCommunityCoverImage, scrollToElement } from '$lib/utils';
	import type { Community } from '$lib/types/api';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ store } = data);
	$: ({ data: storeData } = $store);
	$: community = storeData?.community as Community;
	$: message = Parser.parseFromCategory(community);

	let renderTocPadding = (level: 'h2' | 'h3' | 'h4') => {
		switch (level) {
			case 'h3':
				return 'pl-8';
			case 'h4':
				return 'pl-16';
			default:
				return '';
		}
	};

	let getActiveToc = (url: URL, item: string) => {
		const tag = url.hash;
		return tag && tag.slice(1) === item ? '!text-t1' : '';
	};

	let tocOpen = false;
	let toggleToc = () => {
		tocOpen = !tocOpen;
	};

	let scrollTarget: { url: URL; item: string } | null = null;
	let handleOutroEnd = () => {
		if (scrollTarget !== null) {
			gotoTag(scrollTarget.url, scrollTarget.item);
		}
	};

	let gotoTag = (url: URL, item: string) => {
		// const currentUrl = url;
		// currentUrl.hash = item;
		scrollToElement(item, 64);
		scrollTarget = null;
		// return goto(currentUrl);
	};

	let handleClick = (url: URL, item: string) => {
		scrollTarget = { url, item };
	};
</script>

<MetaTags
	title={message.communitySlug === 'holdex'
		? message.title
		: `${community.name} - ${message.title}`}
	description={message.subtitle ? message.subtitle : ''}
	pageType="article"
	path={routes.message(message.communitySlug, message.messageSlug)}
	imageUrl={message.cover ? message.cover : '/default-cover.png'}
/>

<template lang="pug" src="./template.pug">

</template>
