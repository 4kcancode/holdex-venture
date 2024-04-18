<script>
  const { className, ...rest } = $$props;
</script>

<li class={'mt-0 mb-2 mx-0 pl-0' + className} {...rest}>
  <slot />
</li>
