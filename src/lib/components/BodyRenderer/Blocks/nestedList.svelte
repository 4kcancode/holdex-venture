<script lang="ts">
	type Item = {
		content: any[];
		items: any[];
	};

	export let item: Item;
	export let type: string;
</script>

<li class="text-paragraph-l text-t2">
	{#each item.content as inlineItem}
		<slot item={inlineItem} />
	{/each}
	{#if item.items.length > 0}
		<svelte:element
			this={type === 'unordered' ? 'ul' : 'ol'}
			class="{type === 'unordered' ? 'list-disc' : 'list-decimal'} pl-7"
		>
			{#each item.items as inlineItem}
				<svelte:self item={inlineItem} {type} let:item={inlineItem}>
					<slot item={inlineItem} />
				</svelte:self>
			{/each}
		</svelte:element>
	{/if}
</li>
