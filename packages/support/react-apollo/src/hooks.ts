import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { OperationVariables, QueryResult } from '@apollo/react-common';
import { SubscriptionHookOptions, MutationHookOptions, MutationTuple, LazyQueryHookOptions, QueryHookOptions, QueryTuple } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-client';

declare module '@apollo/react-hooks' {
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
