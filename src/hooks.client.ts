import rollbar from '$components/Rollbar';
import config from '$lib/config';
import transformError from '$lib/utils/errorTransformer';
import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event }) => {
  const { code, message, stack, error: _error } = transformError(error, 'Client error');
  if (!message.includes('Not found') && !message.includes('not_found')) {
    rollbar
      .configure({
        autoInstrument: true,
        payload: {
          environment: config.env,
          client: {
            javascript: {
              source_map_enabled: true,
              guess_uncaught_frames: true,
            },
          },
        },
      })
      .error(message, {
        stack,
        url: event.url,
        route: event.route,
      });
  }

  return {
    code: code,
    message: message,
    error: _error,
  };
};
