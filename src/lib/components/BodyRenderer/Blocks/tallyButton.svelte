<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import Button from '$components/Button/index.svelte';

  type Item = {
    type: string;
    url: string;
    id: string;
    title?: string;
  };
  export let item: Item;
</script>

<template lang="pug">
  .btn-wrapper.flex.flex-col.items-start.py-2
    Button(
      label!="{ item.title ? item.title : 'Apply Now' }"
      size="large"
      data-tally-open="{ item.id }"
      data-tally-emoji-animation="wave"
      data-tally-layout="modal"
      data-tally-overlay="true"
    )
</template>

<svelte:head>
  <script async src="https://tally.so/widgets/embed.js"></script>
</svelte:head>
