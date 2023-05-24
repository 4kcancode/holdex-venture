<script lang="ts">
	import { escape } from '$components/BodyParser/escaper';
	import { Switch, Case } from '$components/Switch';
	import Embed from './embed.svelte';
	import TextWrapper from './textWrapper.svelte';
	import Image from './image.svelte';
	import Link from './link.svelte';

	export let item: any;
	export let value: string;
</script>

{#if value === 'table'}
	{#if item.href && item.type === 'link'}
		<Link
			{item}
			classes={'relative inline-block underline underline-offset-4 bg-accent1-default/15 text-accent1-default transition-colors hover:bg-accent1-default/26'}
		>
			{item.text}
		</Link>
	{:else}
		<template lang="pug" src="../inline.pug">

		</template>
	{/if}
{/if}
