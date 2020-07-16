import { createProgram } from '@graphql-typed-document-node/testing';
import * as ts from 'typescript';

type ApolloClient3Options = {
  prepend?: string;
  append?: string;
  fieldName?: string;
  addIdField?: boolean;
  addDataField?: boolean;
  compilerOptions?: ts.CompilerOptions;
}

const TRIPLE_SLASH_REFERENCE: ApolloClient3Options = { prepend: '/// <reference types="@graphql-typed-document-node/apollo-client-3" />' };
const TYPES_FIELDS_TSCONFIG: ApolloClient3Options = {
  compilerOptions: {
    types: ['@graphql-typed-document-node/apollo-client-3', 'node']
  }
};

describe('Apollo-Client v3', () => {
  const test = (methodName: string, description: string, expectedResultType: string, { prepend = '', append = '', fieldName = 'query', compilerOptions = {}, addIdField = false, addDataField = false }: ApolloClient3Options = {}) => {
    it(`${methodName} - ${description}`, async () => {
      const { program, assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(`
        ${prepend}

        import { ratesQuery } from './types';
        import { ApolloClient } from '@apollo/client';

        const client = new ApolloClient<any>({} as any);
        const result = client.${methodName}({ ${fieldName}: ratesQuery, variables: { currency: "USD" }${addIdField ? ", id: '1'" : ''}${addDataField ? ", data: {}" : ''} });

        ${append}
      `, compilerOptions);
      const errors = getCompilationErrors();
      assertTsErrors(errors);
      const type = getIdentifierInferredType('result');
      expect(type).toBe(expectedResultType);
    });
  };

  // tests for client.query
  test('query', 'should return default type when no triple slash present', 'Promise<ApolloQueryResult<any>>');
  test('query', 'should work correctly with triple-slashes reference', 'Promise<ApolloQueryResult<RatesQuery>>', TRIPLE_SLASH_REFERENCE);
  test('query', 'should work correctly with "types" config of tsconfig.json', 'Promise<ApolloQueryResult<RatesQuery>>', TYPES_FIELDS_TSCONFIG);

  // tests for client.watchQuery
  test('watchQuery', 'should return default type when no triple slash present', 'ObservableQuery<any, { currency: string; }>');
  test('watchQuery', 'should work correctly with triple-slashes reference', 'ObservableQuery<RatesQuery, { currency: string; }>', TRIPLE_SLASH_REFERENCE);
  test('watchQuery', 'should work correctly with "types" config of tsconfig.json', 'ObservableQuery<RatesQuery, { currency: string; }>', TYPES_FIELDS_TSCONFIG);

  // tests for client.subscribe
  test('subscribe', 'should return default type when no triple slash present', 'Observable<FetchResult<any, Record<string, any>, Record<string, any>>>');
  test('subscribe', 'should work correctly with triple-slashes reference', 'Observable<FetchResult<RatesQuery, Record<string, any>, Record<string, any>>>', TRIPLE_SLASH_REFERENCE);
  test('subscribe', 'should work correctly with "types" config of tsconfig.json', 'Observable<FetchResult<RatesQuery, Record<string, any>, Record<string, any>>>', TYPES_FIELDS_TSCONFIG);

  // tests for client.mutate
  test('mutate', 'should return default type when no triple slash present', 'Promise<FetchResult<any, Record<string, any>, Record<string, any>>>', { fieldName: 'mutation' });
  test('mutate', 'should work correctly with triple-slashes reference', 'Promise<FetchResult<RatesQuery, Record<string, any>, Record<string, any>>>', { ...TRIPLE_SLASH_REFERENCE, fieldName: 'mutation' });
  test('mutate', 'should work correctly with "types" config of tsconfig.json', 'Promise<FetchResult<RatesQuery, Record<string, any>, Record<string, any>>>', { ...TYPES_FIELDS_TSCONFIG, fieldName: 'mutation' });

  // tests for client.readQuery
  test('readQuery', 'should return default type when no triple slash present', 'any');
  test('readQuery', 'should work correctly with triple-slashes reference', 'RatesQuery | null', TRIPLE_SLASH_REFERENCE);
  test('readQuery', 'should work correctly with "types" config of tsconfig.json', 'RatesQuery | null', TYPES_FIELDS_TSCONFIG);

  // tests for client.readFragment
  test('readFragment', 'should return default type when no triple slash present', 'any', { addIdField: true, fieldName: 'fragment' });
  test('readFragment', 'should work correctly with triple-slashes reference', 'RatesQuery | null', { ...TRIPLE_SLASH_REFERENCE, addIdField: true, fieldName: 'fragment' });
  test('readFragment', 'should work correctly with "types" config of tsconfig.json', 'RatesQuery | null', { ...TYPES_FIELDS_TSCONFIG, addIdField: true, fieldName: 'fragment' });
});

type ReactApollo3Options = {
  prepend?: string;
  append?: string;
  compilerOptions?: ts.CompilerOptions;
}

describe('React Apollo Hooks (apollo client v3)', () => {
  const testReactApollo = (methodName: string, description: string, expectedResultType: string, { prepend = '', append = '', compilerOptions = {} }: ReactApollo3Options = {}) => {
    it(`${methodName} - ${description}`, async () => {
      const { program, assertTsErrors, getIdentifierInferredType } = await createProgram(`
      ${prepend}

      import { ratesQuery } from './types';
      import { ${methodName} } from '@apollo/client';

      const result = ${methodName}(ratesQuery, { variables: { currency: "USD" } });

      ${append}
    `, compilerOptions);
      const errors = ts.getPreEmitDiagnostics(program);
      assertTsErrors(errors);
      const type = getIdentifierInferredType('result');
      expect(type).toBe(expectedResultType);
    });
  };

  // Tests for usage of `useQuery`
  testReactApollo('useQuery', 'should return default type when no triple slash present', 'QueryResult<any, { currency: string; }>');
  testReactApollo('useQuery', 'should work correctly with triple-slashes reference', 'QueryResult<RatesQuery, { currency: string; }>', TRIPLE_SLASH_REFERENCE);
  testReactApollo('useQuery', 'should work correctly with "types" config of tsconfig.json', 'QueryResult<RatesQuery, { currency: string; }>', TYPES_FIELDS_TSCONFIG);

  // Tests for usage of `useLazyQuery`
  testReactApollo('useLazyQuery', 'should return default type when no triple slash present', 'QueryTuple<any, { currency: string; }>');
  testReactApollo('useLazyQuery', 'should work correctly with triple-slashes reference', 'QueryTuple<RatesQuery, { currency: string; }>', TRIPLE_SLASH_REFERENCE);
  testReactApollo('useLazyQuery', 'should work correctly with "types" config of tsconfig.json', 'QueryTuple<RatesQuery, { currency: string; }>', TYPES_FIELDS_TSCONFIG);

  // Tests for usage of `useMutation`
  testReactApollo('useMutation', 'should return default type when no triple slash present', 'MutationTuple<any, { currency: string; }>');
  testReactApollo('useMutation', 'should work correctly with triple-slashes reference', 'MutationTuple<RatesQuery, { currency: string; }>', TRIPLE_SLASH_REFERENCE);
  testReactApollo('useMutation', 'should work correctly with "types" config of tsconfig.json', 'MutationTuple<RatesQuery, { currency: string; }>', TYPES_FIELDS_TSCONFIG);

  // Tests for usage of `useSubscription`
  testReactApollo('useSubscription', 'should return default type when no triple slash present', '{ variables: { currency: string; } | undefined; loading: boolean; data?: any; error?: ApolloError | undefined; }');
  testReactApollo('useSubscription', 'should work correctly with triple-slashes reference', '{ variables: { currency: string; } | undefined; loading: boolean; data?: RatesQuery | undefined; error?: ApolloError | undefined; }', TRIPLE_SLASH_REFERENCE);
  testReactApollo('useSubscription', 'should work correctly with "types" config of tsconfig.json', '{ variables: { currency: string; } | undefined; loading: boolean; data?: RatesQuery | undefined; error?: ApolloError | undefined; }', TYPES_FIELDS_TSCONFIG);

});