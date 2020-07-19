import { createProgram } from '@graphql-typed-document-node/testing';
import * as ts from 'typescript';

type Options = {
  prepend?: string;
  append?: string;
  compilerOptions?: ts.CompilerOptions;
}

const TRIPLE_SLASH_REFERENCE: Options = { prepend: '/// <reference types="@graphql-typed-document-node/react-apollo" />' };
const TYPES_FIELDS_TSCONFIG: Options = {
  compilerOptions: {
    types: ['@graphql-typed-document-node/react-apollo', 'node']
  }
};

describe('React-Apollo', () => {
  const testReactApollo = (methodName: string, description: string, expectedResultType: string, { prepend = '', append = '', compilerOptions = {} }: Options = {}) => {
    it(`${methodName} - ${description}`, async () => {
      const { program, assertTsErrors, getIdentifierInferredType } = await createProgram(`
        ${prepend}

        import { ratesQuery } from './types';
        import { ${methodName} } from '@apollo/react-hooks';
  
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
