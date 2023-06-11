<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unused-vars */
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { routes } from '$lib/config';
	import MetaTags from '$components/MetaTags/index.svelte';
	import Icon from '$components/Icons/index.svelte';
</script>

<template lang="pug" src="./template.pug">

</template>

<MetaTags
	title="Holdex | Web3 based startup studio"
	description="We empower the next web3 innovators to build and accelerate blockchain adoption."
	path={routes.apply}
	imagePath="/og/index.png"
/>
