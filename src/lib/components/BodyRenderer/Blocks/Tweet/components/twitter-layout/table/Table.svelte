<script>
  const { className, ...rest } = $$props;
</script>

<div class="flexmx-0 my-6 justify-center w-full">
  <table class={'block overflow-auto border-collapse' + className} {...rest}>
    <slot />
  </table>
</div>
