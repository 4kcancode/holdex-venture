<script lang="ts">
	import MetaTags from '$components/MetaTags/index.svelte';
	import Parser, { type Message } from '$components/BodyParser';
	import BodyRenderer from '$components/BodyRenderer/index.svelte';
	import { routes } from '$lib/config';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ store } = data);
	$: ({ data: storeData } = $store);
	$: message = Parser.parse(storeData?.message as Message);
</script>

<MetaTags
	title="About Holdex | Web3 based startup studio"
	description="We empower the next web3 innovators to build and accelerate blockchain adoption"
	path={routes.about}
	imagePath="/og/about.png"
/>

<template lang="pug" src="./template.pug">

</template>
