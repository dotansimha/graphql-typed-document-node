## `graphql-typed-document-node`

This repository is the home for `graphql-typed-document-node` and integration related to it. 

[You can read more, see example and try it out live here](https://the-guild.dev/blog/typed-document-node)

`graphql-typed-document-node` is a development tool for creating fully typed `DocumentNode` objects. It means that just by passing the GraphQL query/mutation/subscription/fragment to a supporting GraphQL client library, you'll get a fully type result object and variables object.

It made possible by [TypeScript type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html).

<img src="https://thumbs.gfycat.com/ArtisticAgreeableHapuku-size_restricted.gif" width="100%" />

This project works in the following way:

1. Configure your project to use this library (see `How to use?`).
2. You write your GraphQL operations (`query` / `mutation` / `subscription` / `fragment`) in any way your prefer (for example - in a `.graphql` file).
3. [GraphQL Code Generator](https://graphql-code-generator.com/) will generate a `TypedDocumentNode` for your operations (which is a bundle of pre-compiled `DocumentNode` with the operation result type and variables type).
4. Instead of using your `.graphql` file - import the generated `TypedDocumentNode` and use it with your GraphQL client framework.
5. You'll get automatic type inference, auto-complete and type checking based on your GraphQL operation. 

## Supported Libraries

Most libraries supports `DocumentNode` as the type of the query object, but that's not enough to use this library. 

Our goal is to get built-in support in major libraries, in order

In order to extend the behavior, we are using `patch-package` library internally, to add support for `TypedDocumentNode` and add the support for type inference. 

The following patches are currently supported:

## Built-in support

- `@apollo/client` (since `3.2.0`, if you are using React Components (`<Query>`) you **still need a patch**)
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

## Upcoming built-in support
- `graphql-js` (v16)

## With Patch

- `graphql` (`14.7.0`, `15.0.0`, `15.1.0`, `~15.2.0`)
- `@apollo/client` (`~3.0.0`, `~3.1.0`)
- `apollo-client` (`~2.6.10`, including `apollo-cache`)
- `react-apollo` (`3.1.5`)
- `apollo-angular` (`1.10.1`)

## How to use?

[You can find a set of examples here](https://github.com/dotansimha/graphql-typed-document-node/tree/master/examples)

To use this library, following these instructions:

1. Install this library, and GraphQL Codegen and the relevant plugins:

```
yarn add -D @graphql-typed-document-node/core @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typed-document-node
```

And if you don't already have a dependency for `graphql`, add it to your project:

```
yarn add graphql
```

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

If you are using a library that doesn't support `TypedDocumentNode` yet, you can apply a patch, by doing:

1. Install the patch-cli:

```
yarn add -D @graphql-typed-document-node/patch-cli
```

2. Configure the patch CLI to run as `postinstall` script:

```json
{
  "scripts": {
    "postinstall": "patch-typed-document-node"
  }
}
```

5. Reinstall dependencies (using npm or yarn) - it will now patch the relevant libraries.

Now, after installing your projects' dependencies, it will make sure to patch all relevant packages and make it available for use with `TypedDocumentNode`.

## Utils

The `core` package of typed-document-node exports 3 types only:

* `TypedDocumentNode` - the base of this library.
* `ResultOf` - a utils for extracting the result type from an existing `TypeDocumentNode` instance (`ResultOf<typeof MyQueryDocument>`)
* `VariablesOf` - a utils for extracting the variables type from an existing `TypeDocumentNode` instance (`VariablesOf<typeof MyQueryDocument>`)

## How can I support this in my library?

If you are a library maintainer, and you wish to have built-in TS support in your library, you can add support for `TypedDocumentNode` without having any breaking changes to your API.

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

export function gqlFetch<TData = any, TVariables = Record<string, any>>(operation: TypedDocumentNode<TData, TVariables>, variables?: TVariables): GqlFetchResult<TData>;
export function gqlFetch<TData = any, TVariables = Record<string, any>>(operation: DocumentNode, variables?: TVariables): GqlFetchResult<TData> {
  // ...
}
```

## How to extend other libraries with this? 

You can create patches using [`patch-package`](https://github.com/ds300/patch-package) and change the `.d.ts` files of any package to add support for `TypedDocumentNode`. 

If you think your patch can be helpful for other developers as well, feel free to open a PR in this repo and add it! 


# Thanks & Inspiration

- https://github.com/dotansimha/graphql-code-generator/issues/1777#issue-437813742 for the concept of generating unified clients support
- https://github.com/Shopify/quilt/blob/main/packages/graphql-typed/src/index.ts for similar idea
