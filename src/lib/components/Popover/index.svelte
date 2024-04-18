<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';

  /**
   * This component is used to render a popover.
   * It is rendered in the app so it can be positioned relative to the viewport.
   * It is positioned relative to the parent element.
   * @prop size - the size of the popover, defaults to 'md'
   *
   * @emits show - when the popover is shown
   * @emits hide - when the popover is hidden
   *
   * @listens mouseenter - when the parent element is hovered
   * @listens mouseleave - when the parent element is no longer hovered
   *
   * @example <SomeParent><Popover on:show={doSomething} on:hide={doSomethingElse}>Hello There</Popover></SomeParent>
   */

  export let size: 'sm' | 'md' = 'md';

  let appContainer: HTMLElement | null = null;
  let parent: HTMLElement | null = null;
  let wrapper: HTMLSpanElement | null = null;
  let popover: HTMLSpanElement | null = null;
  let popoverPointer: HTMLSpanElement | null = null;

  let show = false;
  let dispatch = createEventDispatcher();

  onMount(() => {
    appContainer = document.querySelector('.app-container') || document.body;
    parent = wrapper?.parentElement || null;
    if (parent) {
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    window.addEventListener('resize', placePopover);

    return () => {
      if (parent) {
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', placePopover);
    };
  });

  /** Places popover and popover pointer in the right spot of the viewport */
  const placePopover = () => {
    if (!parent || !popover || !popoverPointer) return;

    // Prevents popover from being rendered outside of the viewport
    popover.style.left = `${Math.max(
      16,
      Math.min(
        parent.offsetLeft - popover.clientWidth / 2 + parent.clientWidth / 2,
        window.innerWidth - popover.clientWidth - 16
      )
    )}px`;
    popover.style.top = `${parent.offsetTop - popover.clientHeight - 8}px`;

    // Always centers the popover pointer relative to parent element
    popoverPointer.style.left = `${
      parent.offsetLeft - popoverPointer.clientWidth / 2 + parent.clientWidth / 2
    }px`;
    popoverPointer.style.top = `${parent.offsetTop - popoverPointer.clientHeight}px`;
  };

  const handleMouseEnter = async () => {
    show = true;
    dispatch('show');
    await tick();

    if (!parent || !appContainer || !popover || !popoverPointer) return;
    placePopover();
    appContainer.appendChild(popover);
    appContainer.appendChild(popoverPointer);
  };

  const handleMouseLeave = () => {
    dispatch('hide');
    show = false;
    if (!popover || !appContainer || !popoverPointer) return;
    appContainer.removeChild(popover);
    appContainer.removeChild(popoverPointer);
  };

  let popoverH = 0;
  let popoverW = 0;
  $: if (popoverH || popoverW) placePopover();
</script>

<span bind:this={wrapper}>
  {#if show}
    <span
      bind:this={popover}
      bind:clientHeight={popoverH}
      bind:clientWidth={popoverW}
      class="
        absolute z-50 rounded-2lg shadow-md text-left bg-l4 text-t2 p-2
        {size === 'sm' ? 'text-caption' : 'text-footnote'}
      "><slot /></span
    >
    <span
      bind:this={popoverPointer}
      class="absolute block z-50 rounded-sm bg-l4 w-4 h-4 rotate-45"
    />
  {/if}
</span>
