<script lang="ts">
	import { regExp } from '$components/BodyParser/utils';
	import { ArrowTopRightOnSquare } from '$components/Icons';
	import Icon from '$components/Icons/index.svelte';
	import { getContext } from 'svelte';

	type Item = {
		type: string;
		text: string;
		href: string;
		title?: string;
	};

	export let item: Item;
	export let parentWrapper = getContext('wrapper');

	let classes = '';

	switch (parentWrapper) {
		case 'table':
			classes =
				'relative inline-block underline underline-offset-4 bg-accent1-default/15 text-accent1-default  transition-colors hover:bg-accent1-default/25';
			break;

		default:
			classes =
				'relative inline-block underline underline-offset-4 bg-accent1-default/15 text-accent1-default text-paragraph-l transition-colors hover:bg-accent1-default/25';
			break;
	}

	$: text = item.text || item.href;
	$: isHoldexLink = regExp.holdexLink.test(item.href);
</script>
{" "}
<a title={item.title ? item.title : ''} href={item.href} class={classes}>
	<slot {text} />
	{#if !isHoldexLink}
		<Icon icon={ArrowTopRightOnSquare} width={16} height={16} colorInherit />
	{/if}
</a>
