<script>
	export let node;
	export let components;
	export let html;
</script>

{#each node as nodeItem}
	{#if nodeItem === null}
		{' '}
	{:else if nodeItem.type === 'text'}
		{@html nodeItem.value}
	{:else if nodeItem.type === 'space'}
		{' '}
	{:else if nodeItem.type === 'mention'}
		<svelte:component this={components.Mention} {...nodeItem} />
	{:else if nodeItem.type === 'hashtag'}
		<svelte:component this={components.Hashtag} {...nodeItem} />
	{:else if nodeItem.type === 'cashtag'}
		<svelte:component this={components.Cashtag} {...nodeItem} />
	{:else if nodeItem.type === 'link'}
		<svelte:component this={components.a} {...nodeItem} />
	{:else if nodeItem.type === 'link-preview'}
		{#if nodeItem.active}
			<svelte:component this={components.linkPreview} {...nodeItem} {html} />
		{:else}
			<svelte:component this={components.a} {...nodeItem} />
		{/if}
	{:else if nodeItem.type === 'image'}
		<svelte:component this={components.img} {...nodeItem} {html} />
	{:else if components[nodeItem.type]}
		<svelte:component this={components[nodeItem.type]} {...nodeItem} />
	{/if}
{/each}
