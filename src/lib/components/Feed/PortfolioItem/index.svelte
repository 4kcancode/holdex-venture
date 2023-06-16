<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import Icon from '$components/Icons/index.svelte';

  import Hashtag from '$components/Hashtag/index.svelte';
  import TextParagraph from '$components/TextParagraph/index.svelte';

  import { ChatBubbleLeftEllipsis, HandThumbUp } from '$components/Icons';
  import { timeFormat, extendedTimeFormat } from '$components/DateManager';
  import { formatNumber } from '$components/NumbersManager';
  import type { ParsedMessage } from '$components/BodyParser';

  export let message: ParsedMessage;

  let className = '';
  export { className as class };
</script>

<template lang="pug" src="./template.pug">
</template>
