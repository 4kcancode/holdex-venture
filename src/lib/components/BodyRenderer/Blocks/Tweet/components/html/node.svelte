<script>
    import Handler from "./handler.svelte";

    export let node;
    export let components;
    export let html;

    const { replies, parsedText } = node;
</script>

<svelte:component this={components.Tweet} data={node}>
    <svelte:component
        this={html ? components.div : components.p}
        className="content-container"
    >
        <Handler node={parsedText} {components} {html} />
    </svelte:component>
    {#if replies && Array.isArray(replies)}
        {#each replies as child}
            <svelte:self node={child} {components} {html} />
        {/each}
    {/if}
</svelte:component>
