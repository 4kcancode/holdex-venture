<script>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-nocheck
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Context from '../../../stories/Context.svelte';
  import Tooltip from './index.svelte';
  import Button from '../Button/index.svelte';
</script>

<Meta
  title="Example/Tooltip"
  component={Tooltip}
  argTypes={{
    tip: { control: 'text' },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'left', 'right'],
      },
    },
    strategy: {
      control: { type: 'select', options: ['absolute', 'fixed'] },
    },
    modifiers: { control: 'object' },
  }}
  args={{
    placement: 'top',
    strategy: 'absolute',
  }}
/>

<Template let:args let:context id="default">
  <Context {...context.globals}>
    <Tooltip {...args} let:ref>
      <button use:ref>Tooltip</button>
    </Tooltip>
  </Context>
</Template>

<Story
  name="Default with HTML"
  args={{
    tip: 'Tooltip',
    placement: 'top',
  }}
  template="default"
/>

<Template let:args let:context id="svelteComponent">
  <Context {...context.globals}>
    <Tooltip {...args} let:ref>
      <Button class={args.class} forwardAction={ref}>Tooltip</Button>
    </Tooltip>
  </Context>
</Template>

<Story
  name="Default with Svelte component"
  args={{
    tip: 'Tooltip',
    placement: 'top',
  }}
  template="svelteComponent"
/>
