import { join } from 'path';
import { createProgram, prepareTempProject } from './test-helpers';
import { applyPatchFile } from '../src/patch';
import ts from 'typescript';

describe('GraphQL', () => {
  const baseDir = join(__dirname, '../src/patches/');
  const originalCwd = process.cwd();

  const usageCode = (method: 'execute' | 'executeSync', variableName = 'currency') => `
  import { RatesDocument } from './types';
  import { ${method}, buildSchema } from 'graphql';

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
    const result = ${method === 'execute' ? 'await ' : ''}${method}({ schema, document: RatesDocument, variableValues: { ${variableName}: "USD" } });
  }
`;

  const testVersion = (version: string, patchFile: string) => {
    describe(version, () => {
      let projectDirectory;

      beforeEach(() => {
        projectDirectory = prepareTempProject({ 'graphql': version });
        process.chdir(projectDirectory)
      });
      afterEach(() => {
        process.chdir(originalCwd);
      });

      for (const methodName of ['execute', 'executeSync'] as const) {
        describe(methodName, () => {
          it('should return "any" when patch isnt performed', async () => {
            const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory, usageCode(methodName));
            const errors = getCompilationErrors();
            assertTsErrors(errors);
            const type = getIdentifierInferredType('result');
            expect(type).toBe(`ExecutionResult<{ [key: string]: any; }, { [key: string]: any; }>`)
          });
  
          it('should return valid type when patch is performed', async () => {
            const patchOk = applyPatchFile(baseDir, patchFile);
            expect(patchOk).toBeTruthy();
            const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory, usageCode(methodName));
            const errors = getCompilationErrors();
            assertTsErrors(errors);
            const type = getIdentifierInferredType('result');
            expect(type).toBe(`ExecutionResult<RatesQuery, { [key: string]: any; }>`)
          });
  
          it('should validate variables correctly', async () => {
            const patchOk = applyPatchFile(baseDir, patchFile);
            expect(patchOk).toBeTruthy();
            const { getCompilationErrors } = await createProgram(projectDirectory, usageCode(methodName, 'currency_invalid'));
            const errors = getCompilationErrors();
            expect(errors.length).toBe(1);
            expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
          });
        });
      }
    });
  };

  testVersion('15.3.0', `graphql+^15.patch`);
})