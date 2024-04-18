import { loadFeed } from '$lib/models/feed';
import type { PostedMessagesConnectionInput } from '$lib/types/api';
import type { PageServerLoad } from './$types';
import { parseQueryFilter } from './util';

export const load: PageServerLoad = async ({ locals, url }) => {
  const filter = url.searchParams.get('filter');
  const q = url.searchParams.get('q');

  const feedInput: PostedMessagesConnectionInput = {
    includeReplies: false,
    sortDesc: true,
    filterByVotesStartingFrom: 0,
    searchTerm: q ?? '',
    ...parseQueryFilter(filter),
    pageInfo: {
      first: 25,
    },
  };

  const options = await loadFeed(locals.apolloClient, feedInput);
  return {
    queryOptions: JSON.stringify(options),
    apollo: locals.apolloClient.extract(),
  };
};
