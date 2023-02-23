import type { DocumentNode } from "graphql";

export type OperationResultType = "stream" | "single";

export interface TypedDocumentNode<
  Result = { [key: string]: any },
  Variables = { [key: string]: any },
  ResultType extends OperationResultType = any
> extends DocumentNode {
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables, resultType: ResultType) => Result;
}

/**
 * Helper for extracting a TypeScript type for operation result from a TypedDocumentNode.
 * @example
 * const myQuery = { ... }; // TypedDocumentNode<R, V>
 * type ResultType = ResultOf<typeof myQuery>; // Now it's R
 */
export type ResultOf<T> = T extends TypedDocumentNode<infer ResultType, any>
  ? ResultType
  : never;

/**
 * Helper for extracting a TypeScript type for operation variables from a TypedDocumentNode.
 * @example
 * const myQuery = { ... }; // TypedDocumentNode<R, V>
 * type VariablesType = VariablesOf<typeof myQuery>; // Now it's V
 */
export type VariablesOf<T> = T extends TypedDocumentNode<
  any,
  infer VariablesType
>
  ? VariablesType
  : never;

/**
 * Helper for extracting a TypeScript type for operation type from a TypedDocumentNode.
 * @example
 * const myQuery = { ... }; // TypedDocumentNode<R, V, O>
 * type OperationType = VariablesOf<typeof myQuery>; // Now it's O
 */
export type OperationTypeOf<T> = T extends TypedDocumentNode<
  any,
  any,
  infer OperationType
>
  ? OperationType
  : never;
