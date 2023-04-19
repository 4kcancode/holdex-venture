import { createServerClient } from '$components/ApolloClient'
import config from '$lib/server/config'
import rollbar from '$components/Rollbar'
import transformError from '$lib/utils/errorTransformer';
import type { Handle, HandleServerError } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.apolloClient = createServerClient(event.fetch)
    const response = await resolve(event)
    return response
}

export const handleError: HandleServerError = ({ error, event }) => {
    const { code, message, stack, error: _error } = transformError(error, 'Server error');
    if (!message.includes('Not found') && !message.includes('not_found')) {
        rollbar.configure({
            accessToken: config.rollbarAccessToken,
            autoInstrument: true,
            nodeSourceMaps: true
        }).error(message, stack, event.request);
    }
    return {
        code: code,
        message: message,
        error: _error
    }
}