import { getMessage } from '$lib/models/message';
import type { Community } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const options = JSON.parse(data.queryOptions);
	const store = await getMessage<{ community: Community }>(data.apollo, options, {
		community: {} as Community,
	});
	return { store };
};
