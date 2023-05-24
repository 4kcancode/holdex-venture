<script lang="ts">
	import Link from './link.svelte';
	export let item: any;
	export let value: string;
</script>

{#if value === 'table'}
	{#if item.href}
		<Link
			{item}
			classes={'relative inline-block underline underline-offset-4 bg-accent1-default/15 text-accent1-default transition-colors hover:bg-accent1-default/26'}
		>
			{item.text}
		</Link>
	{:else}
		{item.text}
	{/if}
{/if}
