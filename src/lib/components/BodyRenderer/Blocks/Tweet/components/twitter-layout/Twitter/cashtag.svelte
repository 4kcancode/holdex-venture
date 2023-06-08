<script>
    import Link from "./link.svelte";
    const { href, value } = $$props;
</script>

<Link {href} type="$">{value}</Link>
