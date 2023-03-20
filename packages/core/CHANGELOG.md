# @graphql-typed-document-node/core

## 3.2.0

### Minor Changes

- [#154](https://github.com/dotansimha/graphql-typed-document-node/pull/154) [`a8bea01`](https://github.com/dotansimha/graphql-typed-document-node/commit/a8bea01b9d9cee70142b2ae7dea48cee5ed2b896) Thanks [@beerose](https://github.com/beerose)! - Export `DocumentTypeDecoration` interface with `__apiType` key so that it can be used to extend types other than `DocumentNode`

## 3.1.2

### Patch Changes

- [#149](https://github.com/dotansimha/graphql-typed-document-node/pull/149) [`2618ddf`](https://github.com/dotansimha/graphql-typed-document-node/commit/2618ddf1ff9c0bea145a637a0a9106ebe3169e78) Thanks [@dotansimha](https://github.com/dotansimha)! - - Cleanup repo structure, ship lightweight type-only package.

  - Use `import type` instead of `import` for `DocumentNode`.
  - Compile and test with latest TS and latest NodeJS LTS.

- [#144](https://github.com/dotansimha/graphql-typed-document-node/pull/144) [`edb47ea`](https://github.com/dotansimha/graphql-typed-document-node/commit/edb47eabf9b7b22baecd9dd3db94be3c7fc69ff4) Thanks [@igrlk](https://github.com/igrlk)! - Added graphql@v17 to peerDependencies
