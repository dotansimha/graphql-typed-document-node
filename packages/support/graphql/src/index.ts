import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLTypeResolver, GraphQLFieldResolver, GraphQLSchema, ExecutionArgs, ExecutionResult } from 'graphql';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { Maybe } from 'graphql/jsutils/Maybe';

declare module 'graphql' {
  export function execute(args: ExecutionArgs): PromiseOrValue<ExecutionResult>;
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
