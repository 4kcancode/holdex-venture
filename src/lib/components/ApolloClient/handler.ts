import type { ApolloQueryResult } from '@apollo/client';
import type { GraphQLError } from 'graphql';

export type BaseHandler<T extends any> = {
	data?: T | null;
	error?: GraphQLError | null;
};

type Handler<T extends any> = (handler: BaseHandler<T>) => BaseHandler<T> | any;

function responseHandler<QueryResponse>(
	response: ApolloQueryResult<any>,
	queryName?: string,
	onSuccess?: Handler<QueryResponse>,
	onError?: Handler<QueryResponse>
): BaseHandler<QueryResponse> {
	if (Array.isArray(response.errors)) {
		if (onError) {
			return onError({ error: response.errors[0] });
		}
		return { error: response.errors[0], data: null };
	} else {
		if (onSuccess) {
			return onSuccess({ data: queryName ? response.data[queryName] : response.data });
		}
		return { error: null, data: queryName ? response.data[queryName] : response.data };
	}
}

export default responseHandler;
