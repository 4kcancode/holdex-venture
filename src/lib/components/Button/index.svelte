<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import Icon from '$components/Icons/index.svelte';

  type Variant = 'primary' | 'secondary' | 'solo';
  type Size = 'small' | 'medium' | 'large';

  export let label: string | undefined = undefined;
  export let onClick: () => void = () => {};

  export let size: Size = 'medium';
  export let variant: Variant = 'primary';

  export let href: string | undefined = undefined;
  export let fixedTo: string | undefined = undefined;
  export let icon: any | undefined = undefined;

  export let disabled = false;
  export let isSubmitBtn = false;

  let className = '';
  export { className as class };

  let clickHandler = () => {
    if (!disabled) {
      return onClick();
    }
    return;
  };

  // Used for control DOM element from outside
  export let forwardRef: HTMLButtonElement | undefined = undefined;
  export let forwardAction: any = () => {};

  export const getRef = () => forwardRef;

  $: variantClass = `btn--${variant}`;
  $: sizeClass = `btn--${size}`;
  $: disabledClass = disabled ? 'btn__disabled' : '';
  $: btnType = isSubmitBtn ? 'submit' : 'button';
  $: iconSize = size === 'small' ? 20 : 24;

  $: btnClass = ['btn', variantClass, sizeClass, className, disabledClass].join(' ');
</script>

<template lang="pug" src="./template.pug">
</template>

<style lang="sass" src="./style.sass">

</style>
