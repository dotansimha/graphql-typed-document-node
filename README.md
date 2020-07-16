## `graphql-typed-document-node`

This repository is the home for `graphql-typed-document-node` and integration related to it. 

`graphql-typed-document-node` is a development tool for creating fully typed `DocumentNode` objects. It means that just by passing the GraphQL query/mutation/subscription/fragment to a supporting GraphQL client library, you'll get a fully type result object and variables object.

It made possible by [TypeScript type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) and by the fact that [TypeScript allows to do module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

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
| `urql`                | Not supported                                  | Requires: [1](https://github.com/FormidableLabs/urql/pull/904)                                                                           |
| `graphql-request`     | Not supported                                  | Requires: [1](https://github.com/prisma-labs/graphql-request/issues/176), [2](https://github.com/prisma-labs/graphql-request/issues/177) |


## How can I use this in my library?

If you are using 


## How to use?

