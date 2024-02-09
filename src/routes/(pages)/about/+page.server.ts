import config from '$lib/config';
import { loadMessage } from '$lib/models/message';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const options = await loadMessage(locals.apolloClient, config.articles.about);

  return {
    queryOptions: JSON.stringify(options),
    apollo: locals.apolloClient.extract(),
  };
};
