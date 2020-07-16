import { createProgram } from '@graphql-typed-document-node/testing';
import * as ts from 'typescript';

type Options = {
  prepend?: string;
  callUsage: string;
  compilerOptions?: ts.CompilerOptions;
}

// const TRIPLE_SLASH_REFERENCE: Options = { prepend: '/// <reference types="@graphql-typed-document-node/graphql" />' };
// const TYPES_FIELDS_TSCONFIG: Options = {
//   compilerOptions: {
//     types: ['@graphql-typed-document-node/graphql', 'node']
//   }
// };

describe('GraphQL', () => {
  const test = (methodName: string, description: string, expectedResultType: string, { prepend = '', callUsage, compilerOptions = {} }: Options) => {
    it(`${methodName} - ${description}`, async () => {
      const { program, assertTsErrors, getIdentifierInferredType } = await createProgram(`
        ${prepend}

        import { ratesQuery } from './types';
        import { ${methodName}, buildSchema } from 'graphql';

        const schema = buildSchema('type Query { foo: String }');
  
        const result = ${methodName === 'execute' ? 'await ' : ''}${methodName}(${callUsage});
      `, compilerOptions);
      const errors = ts.getPreEmitDiagnostics(program);
      assertTsErrors(errors);
      const type = getIdentifierInferredType('result');
      expect(type).toBe(expectedResultType);
    });
  };

  // Tests for usage of `execute`
  test('execute', 'should return default type when no triple slash present', 'QueryResult<any, { currency: string; }>', { callUsage: 'schema,ratesQuery ' });
  // test('useQuery', 'should work correctly with triple-slashes reference', 'QueryResult<RatesQuery, { currency: string; }>', TRIPLE_SLASH_REFERENCE);
  // test('useQuery', 'should work correctly with "types" config of tsconfig.json', 'QueryResult<RatesQuery, { currency: string; }>', TYPES_FIELDS_TSCONFIG);
});
