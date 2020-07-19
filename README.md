## `graphql-typed-document-node`

This repository is the home for `graphql-typed-document-node` and integration related to it. 

`graphql-typed-document-node` is a development tool for creating fully typed `DocumentNode` objects. It means that just by passing the GraphQL query/mutation/subscription/fragment to a supporting GraphQL client library, you'll get a fully type result object and variables object.

It made possible by [TypeScript type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) and by the fact that [TypeScript allows to do module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

<img src="https://thumbs.gfycat.com/ArtisticAgreeableHapuku-size_restricted.gif" width="100%" />

This project works in the following way:

1. Configure your project to use this library, using TypeScript configuration (see `Getting Started`), based on the client framework you use.
2. You write your GraphQL operations (`query` / `mutation` / `subscription` / `fragment`) in any way your prefer (for example - in a `.graphql` file).
3. [GraphQL Code Generator](https://graphql-code-generator.com/) will generate a `TypedDocumentNode` for your operations (which is a bundle of pre-compiled `DocumentNode` with the operation result type and variables type).
4. Instead of using your `.graphql` file - import the generated `TypedDocumentNode` and use it with your GraphQL client framework.
5. You'll get automatic type inference, auto-complete and type checking based on your GraphQL operation. 

## Supported Libraries

Most libraries supports `DocumentNode` as the type of the query object, but that's not enough to use this library. 

In order to extend the behaviour, we are using TypeScript declaration merging to extend libraries support for `TypedDocumentNode` and add the support for type inference. This packages are loaded the same as `@types/` packages, and doesn't effect your runtime, it just extends type declarations for the client library you use. 

| Package               | Supporting Package                             | Details                                                                                                                                  |
|-----------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `apollo-client` (v2)  | `@graphql-typed-document-node/apollo-client-2` | Core library                                                                                                                             |
| `@apollo/client` (v3) | `@graphql-typed-document-node/apollo-client-3` | Core library and React hooks                                                                                                             |
| `react-apollo` (v3)   | `@graphql-typed-document-node/react-apollo`    | React Hooks                                                                                                                              |
| `graphql`             | `@graphql-typed-document-node/graphql`         | `execute` and `executeSync`                                                                                                              |
| `urql`                | Not supported yet                                  | Requires: [1](https://github.com/FormidableLabs/urql/pull/904)                                                                           |
| `graphql-request`     | Not supported yet                                  | Requires: [1](https://github.com/prisma-labs/graphql-request/issues/176), [2](https://github.com/prisma-labs/graphql-request/issues/177) |


## How to use?

[You can find a set of examples here](https://github.com/dotansimha/graphql-typed-document-node/tree/master/examples)

To use this library, following these instructions:

1. Install GraphQL Codegen and the relevant plugins by doing:

```
yarn add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typed-document-node
```

And if you don't already have a dependency for `graphql`, add it to your project:

> Codegen is needed because we need to precompile `.graphql` files into `DocumentNode`, and burns the types in it to create `TypedDocumentNode` object.

2. Create GraphQL-Codegen configuration file, and point to your GraphQL schema and your `.graphql` operations files:

```yml
schema: SCHEMA_FILE_OR_ENDPOINT_HERE
documents: "./src/**/*.graphql"
generates:
  ./src/graphql-operations.ts:
    plugins:
      - typescript
      - typescript-operations
      - typed-document-node
```

3. Try to run codegen by using: `yarn graphql-codegen`, it should create the `./src/graphql-operations.ts` file for you, with the generated `TypedDocumentNode` objects.

4. Install the supporting library according to the GraphQL client you are using (see `Supported Libraries` section for the complete list), for example:

```
yarn add -D @graphql-typed-document-node/graphql
```


At this point, you can chose between adding support for `TypedDocumentNode` for your entire project by loading as part of your `types` configuration in `tsconfig.json` (change to the correct supporting library):

```json
{
  "compilerOptions": {
    // ...
    "types": ["@graphql-typed-document-node/graphql"] 
    // ...
  }
}
```

Or, for only a specific file using TypeScript's [Triple-Slash Directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html), by adding this to your file (change to the correct supporting library):

```ts
/// <reference types="@graphql-typed-document-node/graphql" />
```

## How can I support this in my library?

If you are a library maintainer, and you wish to have built-in TS support in your library, you can add support for `TypedDocumentNode` without having any breaking changes to your API.

You can either use TypeScript's [method overloading](https://www.typescriptlang.org/docs/handbook/functions.html#overloads) or extend the existing behaviour declaration of your methods. 

Basically, in any place where you need to have typed access to the result type of an operation, or to a typed variables object, make sure to have generics for both types, and use `TypeDocumentNode` in your arguments, instead of `DocumentNode`. This will allow TypeScript to infer the types based on the object you are passing to it later. 

#### Before

```ts
type GqlFetchResult = {
  data?: any;
  errors?: Error[];
}

export function gqlFetch(operation: DocumentNode, variables?: Record<string, any>): GqlFetchResult {
  // ...
}
```

#### After

```ts
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

type GqlFetchResult<TData = any> = {
  data?: TData;
  errors?: Error[];
}

export function gqlFetch<TData = any, TVariables = Record<string, any>(operation: TypedDocumentNode<TData, TVariables>, variables?: TVariables): GqlFetchResult<TData>;
export function gqlFetch<TData = any, TVariables = Record<string, any>(operation: DocumentNode, variables?: TVariables): GqlFetchResult<TData> {
  // ...
}
```

## How to extend other libraries with this? 

Take a look at our `support` types libraries under `./packages/support/`. You can easily extend other libraries to support `TypedDocumentNode`, even without changing the library code. 
