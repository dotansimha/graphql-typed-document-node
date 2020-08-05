import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('Apollo Angular', () => {
  const testVersion = (apolloAngularVersion: string) => {
    describe(`apollo-angular@${apolloAngularVersion}`, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({
          'apollo-angular': apolloAngularVersion,
          'apollo-client': '2.6.10',
          'apollo-cache-inmemory': '1.6.6',
          'rxjs': '6.6.2',
          '@angular/core': '10.0.7'
        });
      });

      describe('query', () => {
        it('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { Apollo } from 'apollo-angular';
          
          const client = new Apollo(null as any);
          const result = client.query({ query: RatesDocument, variables: { currency: "USD" } });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`Observable<ApolloQueryResult<RatesQuery>>`)
        });

        it('should validate variables correctly', async () => {
          projectDirectory.patch();
          const { getCompilationErrors } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { Apollo } from 'apollo-angular';

          const client = new Apollo(null as any);
          const result = client.query({ query: RatesDocument, variables: { currency_invalid: "USD" } });
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