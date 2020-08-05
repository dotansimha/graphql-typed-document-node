import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  currency?: Maybe<Scalars['String']>;
  rate?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  rates?: Maybe<Array<Maybe<ExchangeRate>>>;
};


export type QueryRatesArgs = {
  currency: Scalars['String'];
};

export type RatesQueryVariables = Exact<{
  currency: Scalars['String'];
}>;


export type RatesQuery = (
  { __typename?: 'Query' }
  & { rates?: Maybe<Array<Maybe<(
    { __typename?: 'ExchangeRate' }
    & Pick<ExchangeRate, 'currency' | 'rate'>
  )>>> }
);


export const RatesDocument: DocumentNode<RatesQuery, RatesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"rates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"rate"},"arguments":[],"directives":[]}]}}]}}]};