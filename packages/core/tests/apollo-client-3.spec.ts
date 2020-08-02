import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('ApolloClient v3', () => {
  const testVersion = (version: string) => {

    describe(version, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({ '@apollo/client': version });
      });

      describe('readQuery', () => {
        it('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { ApolloClient, InMemoryCache } from '@apollo/client';
          const client = new ApolloClient({ cache: new InMemoryCache() });
          const result = client.readQuery({ query: RatesDocument, variables: { currency: "USD" } });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`RatesQuery | null`)
        });

        it('should validate variables correctly', async () => {
          projectDirectory.patch();
          const { getCompilationErrors } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { ApolloClient, InMemoryCache } from '@apollo/client';
          const client = new ApolloClient({ cache: new InMemoryCache() });
          const result = client.readQuery({ query: RatesDocument, variables: { currency_invalid: "USD" } });
          `);
          const errors = getCompilationErrors();
          expect(errors.length).toBe(1);
          expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
        });
      });

      describe('useQuery', () => {
        it('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
            import { RatesDocument } from './types';
            import { useQuery } from '@apollo/client';
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
            import { useQuery } from '@apollo/client';
            const result = useQuery(RatesDocument, { variables: { currency_invalid: "USD" } });
          `);
          const errors = getCompilationErrors();
          expect(errors.length).toBe(1);
          expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
        });
      });
    });
  };

  testVersion('3.0.0');
  testVersion('3.0.1');
  testVersion('3.0.2');
  testVersion('3.1.0');
  testVersion('3.1.1');
})