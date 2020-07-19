import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLTypeResolver, GraphQLFieldResolver, GraphQLSchema, ExecutionArgs, ExecutionResult, executeSync } from 'graphql';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { Maybe } from 'graphql/jsutils/Maybe';

declare module 'graphql' {
  export function executeSync<TData = any, TVariables = any>(args: Omit<ExecutionArgs, 'document' | 'variableValues'> & { document: TypedDocumentNode<TData, TVariables>, variableValues?: TVariables }): ExecutionResult<TData>;
  export function execute<TData = any, TVariables = any>(args: Omit<ExecutionArgs, 'document' | 'variableValues'> & { document: TypedDocumentNode<TData, TVariables>, variableValues?: TVariables }): PromiseOrValue<ExecutionResult<TData>>;
  export function execute<TData = any, TVariables = any>(
    schema: GraphQLSchema,
    document: TypedDocumentNode<TData, TVariables>,
    rootValue?: any,
    contextValue?: any,
    variableValues?: Maybe<TVariables>,
    operationName?: Maybe<string>,
    fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
    typeResolver?: Maybe<GraphQLTypeResolver<any, any>>,
  ): PromiseOrValue<ExecutionResult<TData>>;
}
