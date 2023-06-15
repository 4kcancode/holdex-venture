<script>
  const { className, ...rest } = $$props;
</script>

<ol class={'p-l4 text-[1.25rem_0]' + className} {...rest}>
  <slot />
</ol>
