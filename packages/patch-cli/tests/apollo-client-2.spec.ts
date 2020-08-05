import { createProgram, prepareTempProject } from './test-helpers';
import ts from 'typescript';

describe('ApolloClient v2', () => {
  const testVersion = (apolloClientVersion: string, apolloCacheInMemoryVersion: string) => {
    describe(`apollo-client@${apolloClientVersion}, apollo-cache-inmemory@${apolloCacheInMemoryVersion}`, () => {
      let projectDirectory: ReturnType<typeof prepareTempProject>;

      beforeEach(() => {
        projectDirectory = prepareTempProject({ 'apollo-client': apolloClientVersion, 'apollo-cache-inmemory': apolloCacheInMemoryVersion });
      });

      describe('readQuery', () => {
        it.only('should return valid type when patch is performed', async () => {
          projectDirectory.patch();
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory.dir, `
          import { RatesDocument } from './types';
          import { ApolloClient } from 'apollo-client';
          import { InMemoryCache } from 'apollo-cache-inmemory';
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
          import { ApolloClient } from 'apollo-client';
          import { InMemoryCache } from 'apollo-cache-inmemory';
          const client = new ApolloClient({ cache: new InMemoryCache() });
          const result = client.readQuery({ query: RatesDocument, variables: { currency_invalid: "USD" } });
          `);
          const errors = getCompilationErrors();
          expect(errors.length).toBe(1);
          expect((errors[0].messageText as ts.DiagnosticMessageChain).messageText).toEqual(`Type '{ currency_invalid: string; }' is not assignable to type 'Exact<{ currency: string; }>'.`);
        });
      });
    });
  };

  testVersion('2.6.10', '1.6.0');
  testVersion('2.6.10', '1.6.6');
})