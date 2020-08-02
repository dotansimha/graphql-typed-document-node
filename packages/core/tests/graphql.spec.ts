import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('GraphQL', () => {
  const usageCode = (variableName: string, withSync: boolean) => `
  import { RatesDocument } from './types';
  import { execute${withSync ? ', executeSync' : ''}, buildSchema } from 'graphql';

  const schema = buildSchema(\`type ExchangeRate {
    currency: String
    rate: String
    name: String
  }
  
  type Query {
    rates(currency: String!): [ExchangeRate]
  }
  \`);

  async function test() {
    const resultAsync = await execute({ schema, document: RatesDocument, variableValues: { ${variableName}: "USD" } });
    ${withSync ? `const resultSync = executeSync({ schema, document: RatesDocument, variableValues: { ${variableName}: "USD" } });` : ''}
  }
`;

  const testVersion = (version: string, withSync = true, expectedResult: string) => {
    describe(version, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({ 'graphql': version });
      });

      it('should return valid type when patch is performed', async () => {
        projectDirectory.patch();
        const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, usageCode('currency', withSync));
        const errors = getCompilationErrors();
        assertTsErrors(errors);
        expect(getIdentifierInferredType('resultAsync')).toBe(expectedResult)

        if (withSync) {
          expect(getIdentifierInferredType('resultSync')).toBe(expectedResult)
        }
      });

      it('should validate variables correctly', async () => {
        projectDirectory.patch();
        const { getCompilationErrors } = await createProgram(projectDirectory.dir, usageCode('currency_invalid', withSync));
        const errors = getCompilationErrors();
        expect(errors.length).toBe(withSync ? 2 : 1);
        expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);

        if (withSync) {
          expect((errors[1].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
        }
      });
    });
  };

  testVersion('15.0.0', false, `ExecutionResult<RatesQuery>`);
  testVersion('15.1.0', false, `ExecutionResult<RatesQuery>`);
  testVersion('15.2.0', true, `ExecutionResult<RatesQuery, { [key: string]: any; }>`);
  testVersion('15.3.0', true, `ExecutionResult<RatesQuery, { [key: string]: any; }>`);
})