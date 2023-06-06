import type { MessagesSortBy } from '$lib/types/api';

export const parseQueryFilter = (filter: any | MessagesSortBy) => {
	switch (filter) {
		case 'CREATED_AT':
		case 'NET_UP_VOTES':
			return {
				sortBy: filter,
			};
		case undefined:
		case null:
			return {
				sortBy: 'CREATED_AT' as MessagesSortBy,
			};
		default:
			return {
				sortBy: 'CREATED_AT' as MessagesSortBy,
				filterByHashtags: [filter],
			};
	}
};
