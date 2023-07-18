import { ApolloError, isApolloError } from '@apollo/client/core';

const transformError = (error: unknown, fallbackMessage: string) => {
  let result: {
    code: string;
    message: string;
    error: any;
    stack: any;
  } = {} as any;

  if (isApolloError(error as any)) {
    const _error = error as ApolloError;
    result = {
      code: '500',
      message: _error.message,
      error: JSON.stringify(_error),
      stack: _error?.networkError || _error?.graphQLErrors || _error,
    };
  } else if (
    error instanceof TypeError ||
    error instanceof ReferenceError ||
    error instanceof SyntaxError
  ) {
    const _error = JSON.stringify(error as any);
    result = {
      code: '500',
      message: (error as any)?.message ?? fallbackMessage,
      error: _error,
      stack: _error,
    };
  } else if (typeof error === 'object') {
    const _error = JSON.stringify(error as any);
    result = {
      code: (error as any)?.code ?? '500',
      message: (error as any)?.message ?? fallbackMessage,
      error: _error,
      stack: _error,
    };
  } else {
    const _error = JSON.stringify(error as any);
    result = {
      code: '500',
      message: fallbackMessage,
      error: _error,
      stack: _error,
    };
  }
  return result;
};

export default transformError;
