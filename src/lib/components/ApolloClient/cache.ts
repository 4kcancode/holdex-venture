import type { InMemoryCacheConfig } from '@apollo/client/core';

const mergePostedMessages = (existing: any, incoming: any, typenameName: string) => {
	const edges = existing ? existing.edges.slice(0) : [];
	let totalCount = existing ? existing.totalCount : 0;
	let pageInfo = existing ? existing.pageInfo : {};

	if (incoming) {
		if (incoming.edges) {
			edges.push(...incoming.edges);
		}
		if (incoming.totalCount) {
			totalCount = incoming.totalCount;
		}
		if (incoming.pageInfo) {
			pageInfo = incoming.pageInfo;
		}
	}
	return {
		__typename: typenameName,
		edges: edges,
		totalCount: totalCount,
		pageInfo: pageInfo,
	};
};

const cacheConfig: InMemoryCacheConfig = {
	typePolicies: {
		Community: {
			fields: {
				postedMessages: {
					keyArgs: [],
					merge: (existing, incoming) =>
						mergePostedMessages(existing, incoming, 'CommunityPostedMessagesConnection'),
				},
			},
		},
		Query: {
			fields: {
				postedMessages: {
					keyArgs: [],
					merge: (existing, incoming) =>
						mergePostedMessages(existing, incoming, 'PostedMessagesConnection'),
				},
			},
		},
	},
};

export default cacheConfig;
