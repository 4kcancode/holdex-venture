import { error } from '@sveltejs/kit';
import { hydrateApolloClient, query, readQuery } from '$components/ApolloClient';
import { getCategoryBySlug } from './query';

import type { ApolloClient } from '@apollo/client/core';
import type { Community, CommunityPostedMessagesConnectionInput } from '$lib/types/api';

export type CommunityQuery = {
  category: string;
  feedInput: CommunityPostedMessagesConnectionInput;
};

const loadCategory = async (
  client: ApolloClient<any>,
  category: string,
  feedInput: CommunityPostedMessagesConnectionInput
) => {
  const options = {
    query: getCategoryBySlug,
    variables: {
      category,
      feedInput,
    } as CommunityQuery,
  };
  const result = await query<Community>(client, options, true);
  if (result.error || !result || result.data === null || !result.data?.published) {
    throw error(404, 'not_found');
  }
  return options;
};

const getCategory = async <T>(apollo: any, options: any, fallback?: T) => {
  const client = hydrateApolloClient(apollo, options.context);
  return readQuery<T>(client, options, fallback);
};

export { loadCategory, getCategory };
