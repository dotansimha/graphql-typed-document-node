import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('react-apollo v3', () => {
  const testVersion = (version: string) => {
    describe(`react-apollo@${version}`, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({
          'react-apollo': version,
          'apollo-client': '2.6.10',
          'apollo-cache-inmemory': '1.6.6'
        });
      });

      describe('query', () => {
        it('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { useQuery } from 'react-apollo';
          
          const result = useQuery(RatesDocument, { variables: { currency: "USD" } });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`QueryResult<RatesQuery, { currency: string; }>`)
        });

        it('should validate variables correctly', async () => {
          projectDirectory.patch();
          const { getCompilationErrors } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { useQuery } from 'react-apollo';
          
          const result = useQuery(RatesDocument, { variables: { currency_invalid: "USD" } });
          `);
          const errors = getCompilationErrors();
          expect(errors.length).toBe(1);
          expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
        });
      });
    });
  };

  testVersion('3.1.5');
})