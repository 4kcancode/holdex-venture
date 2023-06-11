import insane from 'insane';
import type { Community } from '$lib/types/api';

export const scrollToElement = (id: string, offset = 0) => {
	const el = document.getElementById(id);
	const top = findPos(el) - offset;

	window.scrollTo({
		left: 0,
		top: top,
		behavior: 'smooth',
	});
};

const findPos = (obj: any) => {
	let curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while ((obj = obj.offsetParent));
		return curtop;
	}
	return curtop;
};

export const sanitizeHtml = (s: string) => insane(s, {}, true);

export const parseCommunityCoverImage = (community: Community): string => {
	switch (community.slug) {
		case 'announcements':
		case 'jobs':
		case 'learn':
		case 'case-studies':
		case 'founders-club':
		case 'companies':
			return `https://storage.googleapis.com/holdex-public/categories/${community.slug}.png`;
		default:
			return community?.logoUrl;
	}
};
