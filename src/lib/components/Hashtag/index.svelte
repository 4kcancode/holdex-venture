<script lang="ts">
	export let element: string = 'li';

	export let size: 'medium' | 'small' = 'medium';

	export let tag: string;
	export let onClick: () => void;

	export let disabled: boolean = false;

	let className: string = '';
	export { className as class };

	$: sizeClass = `tag--${size}`;
	$: disabledClass = disabled ? 'tag__disabled' : '';

	$: classNames = ['tag', sizeClass, disabledClass, className].join(' ');
</script>

<svelte:element this={element} class={classNames} on:click={onClick}>
	{tag}
</svelte:element>

<style lang="sass" src="./style.sass">

</style>
