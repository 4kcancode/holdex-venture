import type { FetchResult, Observable, ObservableQuery } from '@apollo/client/core';
import { ApolloError } from '@apollo/client/core';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Match Apollo's hook approach, by returning a result with three states:
// loading, error, or data (where data could be null / undefined)

export interface Loading {
  loading: true;
  data?: undefined;
  error?: undefined;
}
export interface Error {
  loading: false;
  data?: undefined;
  error: ApolloError | Error;
}
export interface Data<TData = unknown> {
  loading: false;
  data: TData | null | undefined;
  error?: undefined;
}

export type Result<TData = unknown> = Loading | Error | Data<TData>;

export type WritableResult<TData = unknown> = Writable<Result<TData>>;

export const observableToWritable = <TData = unknown>(
  observable: Observable<FetchResult<TData>>,
  initialValue: Result<TData> = {
    loading: true,
    data: undefined,
    error: undefined,
  }
): WritableResult<TData> => {
  const store = writable<Result<TData>>(initialValue, (set) => {
    const skipDuplicate = initialValue?.data !== undefined;
    let skipped = false;

    const subscription = observable.subscribe(
      (result) => {
        if (skipDuplicate && !skipped) {
          skipped = true;
          return;
        }

        if (result.errors) {
          const error = new ApolloError({ graphQLErrors: result.errors });
          set({ loading: false, data: undefined, error });
        } else {
          set({ loading: false, data: result.data, error: undefined });
        }
      },
      (error) => set({ loading: false, data: undefined, error })
    );

    return () => subscription.unsubscribe();
  });

  return store;
};

// For live queries, ObservableQuery is used, adding methods like refetch
// extend readable with these methods

export interface ObservableQueryExtensions<TData = unknown> {
  fetchMore: ObservableQuery<TData>['fetchMore'];
  getCurrentResult: ObservableQuery<TData>['getCurrentResult'];
  getLastError: ObservableQuery<TData>['getLastError'];
  getLastResult: ObservableQuery<TData>['getLastResult'];
  isDifferentFromLastResult: ObservableQuery<TData>['isDifferentFromLastResult'];
  refetch: ObservableQuery<TData>['refetch'];
  resetLastResults: ObservableQuery<TData>['resetLastResults'];
  resetQueryStoreErrors: ObservableQuery<TData>['resetQueryStoreErrors'];
  result: ObservableQuery<TData>['result'];
  setOptions: ObservableQuery<TData>['setOptions'];
  setVariables: ObservableQuery<TData>['setVariables'];
  startPolling: ObservableQuery<TData>['startPolling'];
  stopPolling: ObservableQuery<TData>['stopPolling'];
  subscribeToMore: ObservableQuery<TData>['subscribeToMore'];
  updateQuery: ObservableQuery<TData>['updateQuery'];
}

export const extensions: Array<keyof ObservableQueryExtensions> = [
  'fetchMore',
  'getCurrentResult',
  'getLastError',
  'getLastResult',
  'isDifferentFromLastResult',
  'refetch',
  'resetLastResults',
  'resetQueryStoreErrors',
  'result',
  'setOptions',
  'setVariables',
  'startPolling',
  'stopPolling',
  'subscribeToMore',
  'updateQuery',
];

export type WritableQuery<TData> = WritableResult<TData> & ObservableQueryExtensions<TData>;

export const observableQueryToWritable = <TData = unknown, TVariables = unknown>(
  query: ObservableQuery<TData, TVariables>,
  initialValue?: Result<TData>
): WritableQuery<TData> => {
  const store = observableToWritable(query, initialValue) as WritableQuery<TData>;

  for (const extension of extensions) {
    store[extension] = query[extension].bind(query) as any;
  }

  return store;
};
