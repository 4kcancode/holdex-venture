<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { Switch, Case } from '$components/Switch';

  import InlineBlock from './inline.svelte';
  import TextWrapper from './Blocks/textWrapper.svelte';
  import NestedList from './Blocks/nestedList.svelte';
  import Image from './Blocks/image.svelte';
  import Embed from './Blocks/embed.svelte';
  import TallyButton from './Blocks/tallyButton.svelte';
  import Chart from './Blocks/chart.svelte';
  import Table from './Blocks/table.svelte';
  import { parseTableCell } from '../BodyParser/blocks';

  export let item: any;
  export let isTableCell: boolean;
  export let index: number;

  let bindHeading = (level: string) => {
    switch (level) {
      case 'h1':
        return 'text-h1-l xs:text-h1-s';
      case 'h2':
        return 'text-h2-l xs:text-h2-s';
      case 'h3':
        return 'text-h3-l xs:text-h3-s';
      case 'h4':
        return 'text-h4-l xs:text-h4-s';
      case 'h5':
        return 'text-h5-l xs:text-h5-s';
      case 'h6':
        return 'text-h6-l xs:text-h6-s';
    }
  };
</script>

<template lang="pug" src="./item.pug">
</template>
