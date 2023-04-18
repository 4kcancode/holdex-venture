import rollbar from '$components/Rollbar';
import config from '$lib/config';
import { type ApolloError, isApolloError } from '@apollo/client/core';
import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event }) => {
    const { code, message, stack, error: _error } = transformError(error);
    if (Number(code) !== 404) {
        rollbar.configure({
            payload: {
                environment: config.env,
                client: {
                    javascript: {
                        source_map_enabled: true,
                        guess_uncaught_frames: true
                    }
                }
            }
        }).error({
            message: message,
            stack: stack
        }, { url: event.url });
    }

    return {
        code: code,
        message: message,
        error: _error,
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
            message: (error as any)?.message ?? 'Client error',
            error: _error,
            stack: _error
        }
    } else {
        const _error = JSON.stringify(error as any);
        return {
            code: '500',
            message: 'Client error',
            error: _error,
            stack: _error
        }
    }
}
