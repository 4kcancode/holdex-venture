<script lang="ts">
	/** internal deps */
	import type { SVGIconName, SVGIconProps } from './types';

	/** props */
	export let name: SVGIconName;
	export let size: string | number = '';
	export let color = '';
	export let svgClass = 'h-full w-full fill-transparent';

	/** vars */
	let hasHClass = false;
	let hasWClass = false;

	/** react-ibles */
	$: hasHClass = /(^|\s)h-/.test($$restProps.class);
	$: hasWClass = /(^|\s)w-/.test($$restProps.class);
	$: hasOpacityClass = /(^|\s)opacity/.test($$restProps.class);
	$: _size = +size ? `${size}px` : size;
	$: finalStyle = `
    ${size ? `height: ${_size};` : ''}
    ${size ? `width: ${_size};` : ''}
    ${color ? `color: ${color};` : ''}${$$restProps.style || ''}`
		.trim()
		.replace(/\s+/g, ' ');
	$: style = finalStyle ? { style: finalStyle } : {};

	/** props type */
	type $$Props = SVGIconProps;
</script>

<i
	class={`SVGIcon fill-current inline-flex items-center ${hasOpacityClass ? '' : 'opacity-100'}${
		!hasWClass ? ' w-full' : ''
	}${!hasHClass ? ' h-full' : ''} ${$$restProps.class || ''}`.trim()}
	{...style}
>
	{#if name === 'sun'}
		<svg viewBox="0 0 20 20" fill="none" class={svgClass}>
			<path
				d="M10 1V3.25M16.364 3.636L14.773 5.227M19 10H16.75M16.364 16.364L14.773 14.773M10 16.75V19M5.227 14.773L3.636 16.364M3.25 10H1M5.227 5.227L3.636 3.636M13.75 10C13.75 10.9946 13.3549 11.9484 12.6517 12.6517C11.9484 13.3549 10.9946 13.75 10 13.75C9.00544 13.75 8.05161 13.3549 7.34835 12.6517C6.64509 11.9484 6.25 10.9946 6.25 10C6.25 9.00544 6.64509 8.05161 7.34835 7.34835C8.05161 6.64509 9.00544 6.25 10 6.25C10.9946 6.25 11.9484 6.64509 12.6517 7.34835C13.3549 8.05161 13.75 9.00544 13.75 10Z"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'moon'}
		<svg viewBox="0 0 21 21" fill="none" class={svgClass}>
			<path
				d="M19.752 14.002C18.5633 14.4975 17.2879 14.7517 16 14.75C10.615 14.75 6.25 10.385 6.25 4.99999C6.25 3.66999 6.516 2.40299 6.998 1.24799C5.22147 1.9891 3.70397 3.23934 2.63663 4.84124C1.56928 6.44314 0.999835 8.32507 1 10.25C1 15.635 5.365 20 10.75 20C12.6749 20.0002 14.5568 19.4307 16.1587 18.3634C17.7606 17.296 19.0109 15.7785 19.752 14.002Z"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<span />
	{/if}
</i>
