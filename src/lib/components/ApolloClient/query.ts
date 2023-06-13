import { observableQueryToWritable, observableToWritable } from './observable';
import type { WritableQuery, WritableResult, Data } from './observable';
import type {
	ApolloClient,
	SubscriptionOptions,
	WatchQueryOptions,
	QueryOptions,
	MutationOptions,
	FetchResult,
	// OperationVariables,
} from '@apollo/client/core';

import responseHandler from './handler';
import queryName from './utils';

import type { BaseHandler } from './handler';

export const readQuery = <TData>(
	client: ApolloClient<any>,
	options: WatchQueryOptions<any, TData>,
	fallback: TData | undefined = undefined
): WritableQuery<TData> => {
	let initialValue: TData | undefined;
	try {
		// undefined = skip initial value (not in cache)
		initialValue = client.readQuery(options) || fallback;
	} catch (err) {
		// Ignore preload errors
	}

	const observable = client.watchQuery<TData>(options);
	const store = observableQueryToWritable(
		observable,
		initialValue !== undefined
			? ({
					data: initialValue,
			  } as Data<TData>)
			: undefined
	);

	return store;
};

export const subscribeQuery = <TData>(
	client: ApolloClient<any>,
	options: SubscriptionOptions<any, TData>
): WritableResult<TData> => {
	const observable = client.subscribe<TData>(options);

	return observableToWritable<TData>(observable);
};

export const query = async <TData>(
	client: ApolloClient<any>,
	options: QueryOptions<any, TData>,
	useQueryName = false
): Promise<BaseHandler<TData>> => {
	const response = await client.query<TData>(options);

	return responseHandler<TData>(response, useQueryName ? queryName(options.query) : undefined);
};

export const mutation = async <TMutation>(
	client: ApolloClient<any>,
	options: MutationOptions<TMutation, any, any>
): Promise<FetchResult<TMutation>> => client.mutate<TMutation>(options);
