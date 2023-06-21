import { error } from '@sveltejs/kit';
import { hydrateApolloClient, query, readQuery } from '$components/ApolloClient';
import {
  getFeedMessages,
  getFeedMessagesForSitemapCursor,
  getFeedMessagesForSitemapLink,
} from './query';

import type { ApolloClient } from '@apollo/client/core';
import type { PostedMessagesConnection, PostedMessagesConnectionInput } from '$lib/types/api';

export type FeedQuery = {
  feedInput: PostedMessagesConnectionInput;
};

const loadFeed = async (client: ApolloClient<any>, feedInput: PostedMessagesConnectionInput) => {
  const options = {
    query: getFeedMessages,
    variables: {
      feedInput,
    } as FeedQuery,
  };
  const result = await query<PostedMessagesConnection>(client, options, true);
  if (result.error || !result || result.data === null) {
    throw error(404, 'not_found');
  }
  return options;
};

const loadFeedForSitemapCursor = async (
  client: ApolloClient<any>,
  headers: Record<string, any>,
  feedInput: PostedMessagesConnectionInput
) => {
  const options = {
    query: getFeedMessagesForSitemapCursor,
    variables: {
      feedInput,
    },
    context: {
      headers,
    },
  };
  return query<PostedMessagesConnection>(client, options, true);
};

const loadFeedForSitemapLink = async (
  client: ApolloClient<any>,
  headers: Record<string, any>,
  feedInput: PostedMessagesConnectionInput
) => {
  const options = {
    query: getFeedMessagesForSitemapLink,
    variables: {
      feedInput,
    },
    context: {
      headers,
    },
  };
  return query<PostedMessagesConnection>(client, options, true);
};

const getFeed = async <T>(apollo: any, options: any, fallback?: T) => {
  const client = hydrateApolloClient(apollo, options.context);
  return readQuery<T>(client, options, fallback);
};

export { loadFeed, loadFeedForSitemapCursor, loadFeedForSitemapLink, getFeed };
