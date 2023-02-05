## `graphql-typed-document-node`

This repository is the home for `graphql-typed-document-node` and integration related to it.

[You can read more, see example and try it out live here](https://the-guild.dev/blog/typed-document-node)

`graphql-typed-document-node` is a development tool for creating fully typed `DocumentNode` objects. It means that just by passing the GraphQL query/mutation/subscription/fragment to a supporting GraphQL client library, you'll get a fully type result object and variables object.

It made possible by [TypeScript type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html).

<img src="https://thumbs.gfycat.com/ArtisticAgreeableHapuku-size_restricted.gif" width="100%" />

This project works in the following way:

1. Configure your project to use this library (see `How to use?` below).
2. Write your GraphQL operations (`query` / `mutation` / `subscription` / `fragment`).
3. [GraphQL Code Generator](https://graphql-code-generator.com/) will generate a `TypedDocumentNode` for your operations (which is a bundle of pre-compiled `DocumentNode` with the operation result type and variables type).
4. You'll get automatic type inference, auto-complete and type checking based on your GraphQL operation.

## Supported Libraries

As of 2022, most GraphQL Client libraries supports `TypedDocumentNode` out of the box.

The following patches are currently supported:

### Built-in support

- `@apollo/client` (v4 and also, `>=3.2.0`, if you are using React Components (`<Query>`) you **still need a patch**)
- `apollo-angular` (since `2.6.0`)
- `@urql/core` (since `1.15.0`)
- `@urql/preact` (since `1.4.0`)
- `urql` (since `1.11.0`)
- `@urql/exchange-graphcache` (since `3.1.11`)
- `@urql/svelte` (since `1.1.3`)
- `villus` (since `1.0.0-beta.8`)
- `graphql-js` (since `15.2.0`)
- `@vue/apollo-composable` (since `4.0.0-alpha.13`)
- `graphql-request` (since `5.0.0`)
- `graphql-js` (since v16)

## How to use?

> ‼️ In most cases, you should not deal with `TypedDocumentNode` directly, but use a library that supports it under the hood.

We recommend to use GraphQL Codegen with [`client-preset`](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client) for the ideal setup. [You can follow the guides section in GraphQL-Codegen website](https://the-guild.dev/graphql/codegen/docs/guides/react-vue)

## Utils

The `core` package of typed-document-node exports 3 types only:

- `TypedDocumentNode` - the base of this library.
- `ResultOf` - a utils for extracting the result type from an existing `TypeDocumentNode` instance (`ResultOf<typeof MyQueryDocument>`)
- `VariablesOf` - a utils for extracting the variables type from an existing `TypeDocumentNode` instance (`VariablesOf<typeof MyQueryDocument>`)

## How can I support this in my library?

If you are a library maintainer, and you wish to have built-in TS support in your library, you can add support for `TypedDocumentNode` without having any breaking changes to your API.

Basically, in any place where you need to have typed access to the result type of an operation, or to a typed variables object, make sure to have generics for both types, and use `TypeDocumentNode` in your arguments, instead of `DocumentNode`. This will allow TypeScript to infer the types based on the object you are passing to it later.

#### Before

```ts
type GqlFetchResult = {
  data?: any;
  errors?: Error[];
};

export function gqlFetch(
  operation: DocumentNode,
  variables?: Record<string, any>
): GqlFetchResult {
  // ...
}
```

#### After

```ts
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

type GqlFetchResult<TData = any> = {
  data?: TData;
  errors?: Error[];
};

export function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): GqlFetchResult<TData>;
export function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: DocumentNode,
  variables?: TVariables
): GqlFetchResult<TData> {
  // ...
}
```

# Thanks & Inspiration

- https://github.com/dotansimha/graphql-code-generator/issues/1777#issue-437813742 for the concept of generating unified clients support
- https://github.com/Shopify/quilt/blob/main/packages/graphql-typed/src/index.ts for similar idea
