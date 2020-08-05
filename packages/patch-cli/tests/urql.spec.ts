import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('Urql', () => {
  const testVersion = (version: string) => {
    describe(version, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({ 'urql': version });
      });

      describe('useQuery', () => {
        it('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
            import { RatesDocument } from './types';
            import { useQuery } from 'urql';
            const result = useQuery({ query: RatesDocument, variables: { currency: "USD" } });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`UseQueryResponse<RatesQuery>`)
        });

        it('should validate variables correctly', async () => {
          projectDirectory.patch();
          const { getCompilationErrors } = await createProgram(projectDirectory.dir, `
            import { RatesDocument } from './types';
            import { useQuery } from 'urql';
            const result = useQuery({ query: RatesDocument, variables: { currency_invalid: "USD" } });
          `);
          const errors = getCompilationErrors();
          expect(errors.length).toBe(1);
          expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
        });
      });
    });
  };

  testVersion('1.10.0');
})