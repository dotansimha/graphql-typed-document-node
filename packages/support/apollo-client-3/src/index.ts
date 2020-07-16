import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { ApolloError, SubscriptionHookOptions, MutationTuple, MutationHookOptions, LazyQueryHookOptions, QueryTuple, QueryResult, QueryHookOptions, DataProxy, QueryOptions, WatchQueryOptions, SubscriptionOptions, MutationOptions, OperationVariables, ObservableQuery, ApolloQueryResult, FetchResult } from '@apollo/client';

declare module '@apollo/client' {
  export class ApolloClient<TCacheShape> implements DataProxy {
    query<T = any, TVariables = OperationVariables>(options: Omit<QueryOptions<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): Promise<ApolloQueryResult<T>>;
    watchQuery<T = any, TVariables = OperationVariables>(options: Omit<WatchQueryOptions<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): ObservableQuery<T, TVariables>;
    mutate<T = any, TVariables = OperationVariables>(options: Omit<MutationOptions<T, TVariables>, 'mutation'> & { mutation: TypedDocumentNode<T, TVariables> }): Promise<FetchResult<T>>;
    subscribe<T = any, TVariables = OperationVariables>(options: Omit<SubscriptionOptions<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): Observable<FetchResult<T>>;
    readQuery<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.Query<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }, optimistic?: boolean): T | null;
    readFragment<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.Fragment<TVariables>, 'fragment'> & { fragment: TypedDocumentNode<T, TVariables> }, optimistic?: boolean): T | null;
    writeQuery<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.WriteQueryOptions<T, TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): void;
    writeFragment<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.WriteFragmentOptions<T, TVariables>, 'fragment'> & { fragment: TypedDocumentNode<T, TVariables> }): void;
  }

  export function useQuery<TData = any, TVariables = OperationVariables>(
    query: TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>
  ): QueryResult<TData, TVariables>;

  export function useLazyQuery<TData = any, TVariables = OperationVariables>(
    query: TypedDocumentNode<TData, TVariables>,
    options?: LazyQueryHookOptions<TData, TVariables>
  ): QueryTuple<TData, TVariables>;

  export function useMutation<TData = any, TVariables = OperationVariables>(
    mutation: TypedDocumentNode<TData, TVariables>,
    options?: MutationHookOptions<TData, TVariables>
  ): MutationTuple<TData, TVariables>;

  export function useSubscription<TData = any, TVariables = OperationVariables>(
    subscription: TypedDocumentNode<TData, TVariables>,
    options?: SubscriptionHookOptions<TData, TVariables>
  ): {
    variables: TVariables | undefined;
    loading: boolean;
    data?: TData | undefined;
    error?: ApolloError | undefined;
  };
}
