import { loadCategory } from '$lib/models/category';
import type { CommunityPostedMessagesConnectionInput } from '$lib/types/api';
import type { PageServerLoad } from './$types';
import { parseQueryFilter } from '../util';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const filter = url.searchParams.get('filter');
	const q = url.searchParams.get('q');

	const feedInput: CommunityPostedMessagesConnectionInput = {
		includeReplies: false,
		sortDesc: true,
		filterByVotesStartingFrom: 0,
		searchTerm: q ?? '',
		...parseQueryFilter(filter),
		pageInfo: {
			first: 25,
		},
	};

	const options = await loadCategory(locals.apolloClient, params.slug, feedInput);

	return {
		queryOptions: JSON.stringify(options),
		apollo: locals.apolloClient.extract(),
	};
};
