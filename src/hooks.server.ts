import { createServerClient } from '$components/ApolloClient'
import config from '$lib/server/config'
import rollbar from '$components/Rollbar'
import { ApolloError, isApolloError } from '@apollo/client/core'
import type { Handle, HandleServerError } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.apolloClient = createServerClient(event.fetch)
    const response = await resolve(event)
    return response
}

export const handleError: HandleServerError = ({ error, event }) => {
    const headers: Record<string, any> = {};
    event.request.headers.forEach((v, k) => (headers[k] = v));
    const { code, message, stack, error: _error } = transformError(error);

    if (!message.includes('Not found') && !message.includes('not_found')) {
        rollbar.configure({ accessToken: config.rollbarAccessToken }).error([message, stack], {
            headers: headers,
            url: event.url,
            method: event.request.method
        });
    }
    return {
        code: code,
        message: message,
        error: _error
    }
}

let transformError = (error: unknown) => {
    if (isApolloError(error as any)) {
        const _error = error as ApolloError;
        return {
            code: '500',
            message: _error.message,
            error: _error,
            stack: _error?.networkError || _error?.graphQLErrors || _error
        }
    } else if (typeof error === "object") {
        const _error = JSON.stringify(error as any);
        return {
            code: (error as any)?.code ?? '500',
            message: (error as any)?.message ?? 'Server error',
            error: _error,
            stack: _error
        }
    } else {
        const _error = JSON.stringify(error as any);
        return {
            code: '500',
            message: 'Server error',
            error: _error,
            stack: _error
        }
    }
}