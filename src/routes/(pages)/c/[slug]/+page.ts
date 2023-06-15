import { getCategory, type CommunityQuery } from '$lib/models/category';
import type { Community } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
  const options = JSON.parse(data.queryOptions);
  const store = await getCategory<{ community: Community }>(data.apollo, options, {
    community: {} as Community,
  });
  return { store, options: options.variables as CommunityQuery };
};
