<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */

  import TextParagraph from '$components/TextParagraph/index.svelte';
  import type numeral from 'numeral';
  import Hashtag from '$components/BodyRenderer/Blocks/hashtag.svelte';

  export let isFeatured: boolean;
  export let communitySlug: string;
  export let messageSlug: string;
  export let title: string;
  export let subtitle: string;
  export let description: string;
  export let hashtags: string[];

  export let totalLoansOriginated: number;
  export let totalValueLocked: number;
  export let founders: string;
  export let investors: string[];
  export let totalFunding: number;
  export let fullyDilutedMarketCap: number;
  let className = '';
  export { className as class };

  function parseNumber(str: string | number): string {
    const num = Number(str);
    if (isNaN(num)) {
      throw new Error(`Cannot parse '${str}' into a number.`);
    }
    return '$' + num.toLocaleString();
  }

  let formattedTotalLoansOriginated: string | undefined;
  let formattedTotalValueLocked: string | undefined;
  let formattedTotalFunding: string | undefined;
  let formattedFullyDilutedMarketCap: string | undefined;

  $: {
    if (totalLoansOriginated !== undefined) {
      formattedTotalLoansOriginated = parseNumber(totalLoansOriginated);
    }
    if (totalValueLocked !== undefined) {
      formattedTotalValueLocked = parseNumber(totalValueLocked);
    }
    if (totalFunding !== undefined) {
      formattedTotalFunding = parseNumber(totalFunding);
    }
    if (fullyDilutedMarketCap !== undefined) {
      formattedFullyDilutedMarketCap = parseNumber(fullyDilutedMarketCap);
    }
  }
</script>

<template lang="pug" src="./template.pug">
</template>
