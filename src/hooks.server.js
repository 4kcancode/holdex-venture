import { createServerClient } from '$components/ApolloClient'
import config from '$lib/server/config'
import rollbar from '$components/Rollbar'

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve, fetch }) => {

    event.locals.apolloClient = createServerClient(fetch)

    const response = await resolve(event)
    return response
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
    const headers = {};
    event.request.headers.forEach((v, k) => (headers[k] = v));
    rollbar.configure({ accessToken: config.rollbarAccessToken }).error({
        message: error.message || "Server error",
        stack: error?.networkError || error?.graphQLErrors || error
    }, {
        headers: headers,
        url: event.url,
        method: event.request.method
    });
    return {
        code: error.code ?? '500',
        message: error.message,
        error: JSON.stringify(error)
    }
}