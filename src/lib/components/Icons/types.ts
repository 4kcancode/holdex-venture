/* eslint-disable no-use-before-define */

export interface SVGIconProps extends Omit<svelte.JSX.HTMLProps<HTMLElement>, 'size' | 'slot'> {
	name: SVGIconName;
	size?: string | number;
	color?: string;
	svgClass?: string;
}

export type SVGIconName = 'sun' | 'moon';
