import { loadFeed } from '$lib/models/feed';
import type { MessagesSortBy, PostedMessagesConnectionInput } from '$lib/types/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const feedInput: PostedMessagesConnectionInput = {
    includeReplies: false,
    sortDesc: true,
    filterByVotesStartingFrom: 0,
    sortBy: 'CREATED_AT' as MessagesSortBy,
    filterByHashtags: ['guides', 'guide'],
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
