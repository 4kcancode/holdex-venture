<script lang="ts">
  /**
   * A Tooltip Component
   * @component
   */
  import { fade } from 'svelte/transition';

  import type { Placement, PositioningStrategy } from '@popperjs/core';

  import { portal } from '$lib/utils';

  import { createPopperActions } from './tooltip';

  export let tip: string;
  export let placement: Placement = 'top';
  export let strategy: PositioningStrategy = 'absolute';
  export let modifiers: Array<any> = [];
  export let link: { href: string; text: string } | undefined = undefined;

  let className = '';
  let isTooltipHovered = false;
  export { className as class };

  const defaultModifiers = [
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
  ];

  const [popperRef, popperContent] = createPopperActions({
    modifiers: defaultModifiers,
  });

  $: popperOptions = {
    placement,
    strategy,
    modifiers: [...defaultModifiers, ...modifiers],
  };

  async function waitForDelay(delay: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }

  let isShown = false;
  const onMouseEnter = (ev: Event) => {
    isShown = true;
  };

  const onMouseLeave = async (ev: Event) => {
    await waitForDelay(300);
    if (!isTooltipHovered) {
      isShown = false;
    } else {
      isShown = true;
    }
  };

  const onMouseLeaveTooltip = () => {
    isTooltipHovered = false;
    if (!isTooltipHovered) {
      isShown = false;
    }
  };

  const onTooltipHover = () => {
    isTooltipHovered = true;
  };

  const handlers = { onMouseEnter, onMouseLeave };

  const handleRef = (node: HTMLElement) => {
    return popperRef(node, handlers);
  };
</script>

<slot ref={handleRef} {isShown} />
{#if isShown && (tip || $$slots.tip)}
  <div
    transition:fade|local={{ duration: 300 }}
    class="tooltip level1 {className}"
    id="tooltip"
    data-placement={placement}
    use:portal={'#layers'}
    use:popperContent={popperOptions}
    role="tooltip"
    on:mouseenter={onTooltipHover}
    on:mouseleave={onMouseLeaveTooltip}
  >
    <slot name="tip">
      <!-- This link replacement is done due to an issue with how pug interprets `<` or `>` in strings when using JSX -->
      {@html tip.replace(
        '%link%',
        `<a class='text-brand-50' href='${link?.href}'>${link?.text}</a>`
      )}
    </slot>
    <span class="tooltip-arrow" id="arrow" data-popper-arrow>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9">
        <path
          d="M 0 0 L 0 -2 L 12 -2 L 12 0 L 7.664 6.504 C 6.872 7.691 5.128 7.691 4.336 6.504 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  </div>
{/if}

<style lang="sass" src="./style.sass">

</style>
