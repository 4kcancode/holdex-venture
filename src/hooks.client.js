import rollbar from '$components/Rollbar';

/** @type {import('@sveltejs/kit').HandleClientError} */
export const handleError = async ({ error, event }) => {
    const headers = {};
    event.request.headers.forEach((v, k) => (headers[k] = v));

    rollbar.error({
        message: error.message || "Client error",
        stack: error?.networkError || error?.graphQLErrors || error
    }, {
        headers: headers,
        url: event.url,
        method: event.request.method
    });

    const _error = JSON.parse(error);
    return {
        code: error.code ?? '500',
        message: error.message,
        error: _error,
    }
}
