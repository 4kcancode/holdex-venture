import { getFeed, type FeedQuery } from '$lib/models/feed';
import type { PostedMessagesConnection } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
  const options = JSON.parse(data.queryOptions);
  const store = await getFeed<{ postedMessages: PostedMessagesConnection }>(data.apollo, options, {
    postedMessages: {} as PostedMessagesConnection,
  });
  return { store, options: options.variables as FeedQuery };
};
