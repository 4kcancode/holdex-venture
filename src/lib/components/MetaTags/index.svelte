<script lang="ts">
	import { getContext } from 'svelte';

	export let title: string;
	export let description: string;
	export let path: string = '';
	export let imagePath: string = '';
	export let imageUrl: string | undefined = undefined;
	export let pageType: string | undefined = undefined;
	export let pageName: string | undefined = undefined;

	let deploymentUrl = getContext<string>('deploymentUrl');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="og:url" content="{deploymentUrl}{path}" />
	<meta name="og:title" content={title} />
	<meta name="og:description" content={description} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if imageUrl}
		<meta name="og:image" content={imageUrl} />
		<meta name="twitter:image" content={imageUrl} />
	{:else}
		<meta name="og:image" content="{deploymentUrl}{imagePath}" />
		<meta name="twitter:image" content="{deploymentUrl}{imagePath}" />
	{/if}
	{#if pageType}
		<meta name="og:type" content={pageType} />
	{/if}
	{#if pageName}
		<meta name="og:site_name" content={pageName} />
	{/if}
</svelte:head>
