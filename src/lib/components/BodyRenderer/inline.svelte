<script lang="ts">
	import { escape } from '$components/BodyParser/escaper';
	import { Switch, Case } from '$components/Switch';
	import Embed from './Blocks/embed.svelte';
	import TextWrapper from './Blocks/textWrapper.svelte';
	import Image from './Blocks/image.svelte';
	import Link from './Blocks/link.svelte';

	type Item = {
		type: string;
		text: string;
		href: string;
		title?: string;
	};

	export let item: Item;
	export let isInTableCell: boolean;
</script>

{#if isInTableCell}
	{#if item.type==='link'}
		{" "}
		<Link item={item} classes={"relative inline-block underline underline-offset-4 bg-accent1-default/15 text-accent1-default transition-colors hover:bg-accent1-default/26"}>
		{item.text}
		</Link>
		{:else}
		<svelte:self item={item}>
			<slot item={item} />
		</svelte:self>

	{/if}
	{:else}
		<template lang="pug" src="./inline.pug">
		</template>
{/if}

<style lang="sass">
	:global(b),
	:global(em),
	:global(strong)
		@apply text-t1
</style>
