import { getMessage } from '$lib/models/message';
import type { Message } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch }) => {
  const options = JSON.parse(data.queryOptions);
  const store = await getMessage<{ message: Message }>(data.apollo, options, {
    message: {} as Message,
  });
  return { store, fetch };
};
