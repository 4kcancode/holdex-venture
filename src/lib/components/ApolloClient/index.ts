import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';
import config, { isDev } from '$lib/config';

import { readQuery, subscribeQuery, query, mutation } from './query';
import cacheConfig from './cache';

/**
 * Initialize new Client instance
 * @returns Apollo Client
 */
function createServerClient(fetch: any) {
	return new ApolloClient({
		credentials: 'include',
		link: new HttpLink({
			uri: config.apiUrl,
			fetch,
		}),
		ssrMode: true,
		cache: new InMemoryCache(cacheConfig),
	});
}

const browserClient = createBrowserClient();
function createBrowserClient() {
	return new ApolloClient({
		credentials: 'omit',
		link: new HttpLink({
			uri: config.apiUrl,
		}),
		cache: new InMemoryCache(cacheConfig),
		ssrForceFetchDelay: 100,
		connectToDevTools: isDev,
	});
}

function hydrateApolloClient(client: any, context?: Record<string, string>) {
	browserClient.restore(client as any);
	if (context) {
		browserClient.setLink(
			new HttpLink({
				uri: context.uri,
			})
		);
	}
	return browserClient;
}

export { createServerClient, hydrateApolloClient, readQuery, subscribeQuery, query, mutation };
