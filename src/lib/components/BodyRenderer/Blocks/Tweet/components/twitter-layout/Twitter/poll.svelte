<script>
	import { howFarFromNow } from '$components/DateManager';
	import { getContext } from 'svelte';

	const data = $$props.data;

	const votesCount = data.options.reduce((count, option) => count + option.votes, 0);
	const endsAt = new Date(data.endsAt);
	const now = new Date();

	$: optionWidth = (option) => Math.round((option.votes / votesCount) * 100) || 1;
	$: optionWidthLabel = (option) => Math.round((option.votes / votesCount) * 100) || 0;

	const theme = getContext('theme');
</script>

<div class="mx-4 my-6">
	<div
		class="@apply grid grid-cols-[max-content_14rem_max-content] items-center gap-4 overflow-auto;"
	>
		{#each data.options as option}
			<span class="label overflow-auto text-right whitespace-pre-wrap">{option.label}</span>
			<span
				class="bg-tw-tweet-poll-bar-color h-full {$theme}"
				style="width: {optionWidth(option)}"
			/>
			<span>{optionWidthLabel(option)}%</span>
		{/each}
	</div>
	<hr class="mt-4 mb-2 mx-0 border-t border-tw-tweet-border{$theme}" />
	<div class="text-tw-accents-4 flex text-sm {$theme}">
		<span class="grow">{votesCount} votes</span>
		<span>{now > endsAt ? 'Final results' : `${howFarFromNow(endsAt)} left`}</span>
	</div>
</div>

<style lang="sass">
    .label 
        word-wrap: break-word

    @media screen and (max-width: 450px)
        .options
            grid-template-columns: max-content 7rem max-content
</style>
