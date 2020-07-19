import { createProgram } from '@graphql-typed-document-node/testing';
import * as ts from 'typescript';

type Options = {
  prepend?: string;
  callUsage?: string;
  compilerOptions?: ts.CompilerOptions;
}

const TRIPLE_SLASH_REFERENCE: Options = { prepend: '/// <reference types="@graphql-typed-document-node/graphql" />' };
const TYPES_FIELDS_TSCONFIG: Options = {
  compilerOptions: {
    types: ['@graphql-typed-document-node/graphql', 'node']
  }
};

describe('GraphQL', () => {
  const test = (methodName: string, description: string, expectedResultType: string, { prepend = '', callUsage, compilerOptions = {} }: Options) => {
    it(`${methodName} - ${description}`, async () => {
      const { program, assertTsErrors, getIdentifierInferredType } = await createProgram(`
        ${prepend}

        import { ratesQuery } from './types';
        import { ${methodName}, buildSchema } from 'graphql';

        async function test() {
          const schema = buildSchema('type Query { foo: String }');
          const result = ${methodName === 'execute' ? 'await ' : ''}${methodName}(${callUsage});
        }
      `, compilerOptions);
      const errors = ts.getPreEmitDiagnostics(program);
      assertTsErrors(errors);
      const type = getIdentifierInferredType('result');
      expect(type).toBe(expectedResultType);
    });
  };

  // Tests for usage of `execute` with multiple params
  const MULTILE_PARAMS_CALL_ARGS = 'schema, ratesQuery, null, null, { currency: "ILS" }';
  test('execute', 'should return default type when no triple slash present', 'ExecutionResult<{ [key: string]: any; }, { [key: string]: any; }>', { callUsage: MULTILE_PARAMS_CALL_ARGS });
  test('execute', 'should work correctly with triple-slashes reference', 'ExecutionResult<RatesQuery, { [key: string]: any; }>', { ...TRIPLE_SLASH_REFERENCE, callUsage: MULTILE_PARAMS_CALL_ARGS });
  test('execute', 'should work correctly with "types" config of tsconfig.json', 'ExecutionResult<RatesQuery, { [key: string]: any; }>', { ...TYPES_FIELDS_TSCONFIG, callUsage: MULTILE_PARAMS_CALL_ARGS });

  // Tests for usage of `execute` with single param
  const SINGLE_PARAM_CALL_ARGS = '{ schema, document: ratesQuery, variableValues: { currency: "ILS" }}';
  test('execute', 'should return default type when no triple slash present - single argument', 'ExecutionResult<{ [key: string]: any; }, { [key: string]: any; }>', { callUsage: SINGLE_PARAM_CALL_ARGS });
  test('execute', 'should work correctly with triple-slashes reference - single argument', 'ExecutionResult<RatesQuery, { [key: string]: any; }>', { ...TRIPLE_SLASH_REFERENCE, callUsage: SINGLE_PARAM_CALL_ARGS });
  test('execute', 'should work correctly with "types" config of tsconfig.json - single argument', 'ExecutionResult<RatesQuery, { [key: string]: any; }>', { ...TYPES_FIELDS_TSCONFIG, callUsage: SINGLE_PARAM_CALL_ARGS });

  // Tests for usage of `executeSync` with single param
  test('executeSync', 'should return default type when no triple slash present', 'ExecutionResult<{ [key: string]: any; }, { [key: string]: any; }>', { callUsage: SINGLE_PARAM_CALL_ARGS });
  test('executeSync', 'should work correctly with triple-slashes reference', 'ExecutionResult<RatesQuery, { [key: string]: any; }>', { ...TRIPLE_SLASH_REFERENCE, callUsage: SINGLE_PARAM_CALL_ARGS });
  test('executeSync', 'should work correctly with "types" config of tsconfig.json', 'ExecutionResult<RatesQuery, { [key: string]: any; }>', { ...TYPES_FIELDS_TSCONFIG, callUsage: SINGLE_PARAM_CALL_ARGS });
});
