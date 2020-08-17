import { DocumentNode } from 'graphql';

export interface TypedDocumentNode<Result = { [key: string]: any }, Variables = { [key: string]: any }> extends DocumentNode {
  __resultType?: Result;
  __variablesType?: Variables;
}

/**
 * Helper for extracting a TypeScript type for operation result from a TypedDocumentNode.
 * @example
 * const myQuery = { ... }; // TypedDocumentNode<R, V> 
 * type ResultType = ResultOf<typeof myQuery>; // Now it's R
 */
export type ResultOf<T> = T extends TypedDocumentNode<infer ResultType, infer VariablesType> ? ResultType : never;

/**
 * Helper for extracting a TypeScript type for operation variables from a TypedDocumentNode.
 * @example
 * const myQuery = { ... }; // TypedDocumentNode<R, V> 
 * type VariablesType = ResultOf<typeof myQuery>; // Now it's V
 */
export type VariablesOf<T> = T extends TypedDocumentNode<infer ResultType, infer VariablesType> ? VariablesType : never;
