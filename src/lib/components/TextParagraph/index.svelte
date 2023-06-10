<script lang="ts">
	export let element = 'p';
	export let responsive = true;
	export let textColor = 'text-t1';

	let className = '';
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
