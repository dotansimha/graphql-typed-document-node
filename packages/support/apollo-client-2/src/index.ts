import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { OperationVariables, WatchQueryOptions, SubscriptionOptions, MutationOptions, QueryOptions, ObservableQuery, ApolloQueryResult } from 'apollo-client';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'apollo-link';
import { Observable } from 'apollo-client/util/Observable';

declare module 'apollo-client' {
  export default interface ApolloClient<TCacheShape> extends DataProxy {
    query<T = any, TVariables = OperationVariables>(options: Omit<QueryOptions<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): Promise<ApolloQueryResult<T>>;
    watchQuery<T = any, TVariables = OperationVariables>(options: Omit<WatchQueryOptions<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): ObservableQuery<T, TVariables>;
    mutate<T = any, TVariables = OperationVariables>(options: Omit<MutationOptions<T, TVariables>, 'mutation'> & { mutation: TypedDocumentNode<T, TVariables>}): Promise<FetchResult<T>>;
    subscribe<T = any, TVariables = OperationVariables>(options: Omit<SubscriptionOptions<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): Observable<FetchResult<T>>;
    readQuery<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.Query<TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }, optimistic?: boolean): T | null;
    readFragment<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.Fragment<TVariables>, 'fragment'> & { fragment: TypedDocumentNode<T, TVariables> }, optimistic?: boolean): T | null;
    writeQuery<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.WriteQueryOptions<T, TVariables>, 'query'> & { query: TypedDocumentNode<T, TVariables> }): void;
    writeFragment<T = any, TVariables = OperationVariables>(options: Omit<DataProxy.WriteFragmentOptions<T, TVariables>, 'fragment'> & { fragment: TypedDocumentNode<T, TVariables> }): void;
  }
}
