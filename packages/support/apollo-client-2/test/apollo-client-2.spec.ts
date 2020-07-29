import { createProgram } from '@graphql-typed-document-node/testing';
import * as ts from 'typescript';

type Options = {
  prepend?: string;
  append?: string;
  fieldName?: string;
  addIdField?: boolean;
  addDataField?: boolean;
  compilerOptions?: ts.CompilerOptions;
}

const TRIPLE_SLASH_REFERENCE: Options = { prepend: '/// <reference types="@graphql-typed-document-node/apollo-client-2" />' };
const TYPES_FIELDS_TSCONFIG: Options = {
  compilerOptions: {
    types: ['@graphql-typed-document-node/apollo-client-2', 'node']
  }
};

describe('Apollo-Client v2', () => {
  const test = (methodName: string, description: string, expectedResultType: string, { prepend = '', append = '', fieldName = 'query', compilerOptions = {}, addIdField = false, addDataField = false }: Options = {}) => {
    it(`${methodName} - ${description}`, async () => {
      const { program, assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(`
        ${prepend}

        import { RatesDocument } from './types';
        import { ApolloClient } from 'apollo-client';

        const client = new ApolloClient<any>({} as any);
        const result = client.${methodName}({ ${fieldName}: RatesDocument, variables: { currency: "USD" }${addIdField ? ", id: '1'" : ''}${addDataField ? ", data: {}" : ''} });

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
