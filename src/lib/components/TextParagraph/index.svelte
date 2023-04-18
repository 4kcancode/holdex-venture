<script lang="ts">
	export let element: string = 'p';
	export let responsive: boolean = true;
	export let textColor: string = 'text-t1';

	let className: string = '';
	export { className as class };

	$: classNames = [
		'text-paragraph-l',
		textColor,
		responsive ? 'xs:text-paragraph-s' : '',
		className
	].join(' ');
</script>

<svelte:element this={element} class={classNames}>
	<slot />
</svelte:element>
