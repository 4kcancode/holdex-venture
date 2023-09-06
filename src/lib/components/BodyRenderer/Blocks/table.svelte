<script lang="ts">
  import { onMount } from 'svelte';
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import Item from '../item.svelte';

  export let cells: any[];

  let isLeftEnd = true;
  let isRightEnd = false;

  let hasRoomToScrollRight = 0;
  let hasRoomToScrollLeft = 0;

  let tableWidth;

  const scrollAction = (node: HTMLElement) => {
    const hasReachedRightEnd = () => {
      const tableScrollElement = document.getElementById('table-scroll');

      if (!node || !tableScrollElement) {
        console.log('return');
        return;
      }

      const maxScroll = tableScrollElement.clientWidth - node!.parentElement!.clientWidth;

      hasRoomToScrollLeft = node?.scrollLeft;

      isLeftEnd = hasRoomToScrollLeft === 0;

      const hasRoomToScrollRight = maxScroll - hasRoomToScrollLeft;

      let rect = node.getBoundingClientRect();

      isRightEnd = isLeftEnd || maxScroll - hasRoomToScrollLeft >= 0;

      if (
        (!isLeftEnd && hasRoomToScrollLeft === node.scrollWidth - node.offsetWidth) ||
        hasRoomToScrollRight === 0
      ) {
        isRightEnd = false;
      }
    };

    node.addEventListener('scroll', hasReachedRightEnd, false);

    hasReachedRightEnd();

    return {
      destory() {
        node.removeEventListener('scroll', hasReachedRightEnd);
      },
    };
  };
</script>

{#if cells.length}
  <div
    class="md-up:w-[604px] lg-up:w-[710px] xs:w-full xs:left-0 relative tablescroll p-3 w-full text-left z-1"
  >
    <div class="w-full" bind:clientWidth={tableWidth}>
      <template lang="pug" src="./table.pug">
      </template>
    </div>
  </div>
{/if}
