<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import TextParagraph from '$components/TextParagraph/index.svelte';
  import type { ParsedMessage } from '$components/BodyParser';

  export let message: ParsedMessage;
  let className = '';
  export { className as class };
</script>

<template lang="pug" src="./template.pug">
</template>
