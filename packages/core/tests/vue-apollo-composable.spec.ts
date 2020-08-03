import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('@vue/apollo-composable', () => {
  const testVersion = (version: string, compositionApiVersion: string) => {
    describe(`@vue/apollo-composable@${version}`, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({
          "@vue/apollo-composable": version,
          "@vue/composition-api": compositionApiVersion,
          "vue": "2.6.10",
          'apollo-client': '2.6.10'
        });
      });

      describe('useQuery', () => {
        it('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { useQuery } from '@vue/apollo-composable'
          
          const result = useQuery(RatesDocument, { currency: "USD" });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`UseQueryReturn<RatesQuery, { currency: string; }>`)
        });

        it('should validate variables correctly', async () => {
          projectDirectory.patch();
          const { getCompilationErrors } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { useQuery } from '@vue/apollo-composable'
          
          const result = useQuery(RatesDocument, { currency_invalid: "USD" });
          `);
          const errors = getCompilationErrors();
          expect(errors.length).toBe(1);
          expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Argument of type '{ currency_invalid: string; }' is not assignable to parameter of type 'Exact<{ currency: string; }>'.`);
        });
      });
    });
  };

  testVersion('4.0.0-alpha.10', '0.6.1');
})