<script context="module" lang="ts">
	type AllowedTags = 'path' | 'circle' | 'rect' | 'polygon' | 'polyline' | 'line';
	type IconThemeSource = {
		a: { [attribute: string]: string };
	} & {
		[tag in AllowedTags]?: Array<{ [attribute: string]: string }>;
	};
	type IconSource = { solid: IconThemeSource } | { default: IconThemeSource };
</script>

<script lang="ts">
	export let icon: IconSource;
	export let width = 24;
	export let height = 24;
	export let isOutlined = false;
	export let colorInherit = false;
	export let onClick: () => void = () => {};

	// @ts-ignore
	let iconProps = icon[isOutlined ? 'default' : 'solid'];

	export let forwardRef: SVGSVGElement | null = null;
	export let forwardAction: any = () => {};

	let className = '';
	export { className as class };
</script>

<svg
	bind:this={forwardRef}
	use:forwardAction
	class="icon inline-flex relative {className}"
	on:click={onClick}
	class:icon-outline={isOutlined}
	class:color-inherited={colorInherit}
	{...iconProps?.a}
	{...$$restProps}
	{width}
	{height}
>
	{#each iconProps?.path ?? [] as a}
		<path {...a} />
	{/each}
	{#each iconProps?.rect ?? [] as a}
		<rect {...a} />
	{/each}
	{#each iconProps?.circle ?? [] as a}
		<circle {...a} />
	{/each}
	{#each iconProps?.polygon ?? [] as a}
		<polygon {...a} />
	{/each}
	{#each iconProps?.polyline ?? [] as a}
		<polyline {...a} />
	{/each}
	{#each iconProps?.line ?? [] as a}
		<line {...a} />
	{/each}
</svg>

<style lang="sass" src="./style.sass">
    .icon-outline.color-inherited path
        stroke: currentColor
        fill: unset

    .color-inherited path
        fill: currentColor
</style>
