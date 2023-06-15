import { error } from '@sveltejs/kit';
import { hydrateApolloClient, query, readQuery } from '$components/ApolloClient';
import type { ApolloClient } from '@apollo/client/core';

import { getMessageById, getMessageByCategorySlug } from './query';
import type { Community, Message } from '$lib/types/api';

const loadMessage = async (client: ApolloClient<any>, id: string) => {
  const options = {
    query: getMessageById,
    variables: {
      id,
    },
  };
  const result = await query<Message>(client, options, true);
  if (result.error || (result && result.data === null)) {
    throw error(404, 'not_found');
  }
  return options;
};

const loadMessageFromCategory = async (
  client: ApolloClient<any>,
  category: string,
  messageSlug: string
) => {
  const options = {
    query: getMessageByCategorySlug,
    variables: {
      category,
      messageSlug,
    },
  };
  const result = await query<Community>(client, options, true);
  if (
    result.error ||
    (result && (!result.data || result.data.postedThread === null || !result.data.published))
  ) {
    throw error(404, 'not_found');
  }
  return options;
};

const getMessage = async <T>(apollo: any, options: any, fallback?: T) => {
  const client = hydrateApolloClient(apollo, options.context);
  return readQuery<T>(client, options, fallback);
};

export { loadMessage, getMessage, loadMessageFromCategory };
