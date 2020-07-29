import { join } from 'path';
import { createProgram, prepareTempProject } from './test-helpers';
import { applyPatchFile } from '../src/patch';
import ts from 'typescript';

describe('ApolloClient v3', () => {
  const baseDir = join(__dirname, '../src/patches/');
  const originalCwd = process.cwd();

  const testVersion = (version: string, patchFile: string) => {

    describe(version, () => {
      let projectDirectory;

      beforeEach(() => {
        projectDirectory = prepareTempProject({ '@apollo/client': version });
        process.chdir(projectDirectory)
      });
      afterEach(() => {
        process.chdir(originalCwd);
      });

      describe('readQuery', () => {
        it('should return "any" when patch isnt performed', async () => {
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory, `
            import { RatesDocument } from './types';
            import { ApolloClient, InMemoryCache } from '@apollo/client';
            const client = new ApolloClient({ cache: new InMemoryCache() });
            const result = client.readQuery({ query: RatesDocument, variables: { currency: "USD" } });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`any`)
        });

        it('should return valid type when patch is performed', async () => {
          const patchOk = applyPatchFile(baseDir, patchFile);
          expect(patchOk).toBeTruthy();

          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory, `
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
          const patchOk = applyPatchFile(baseDir, patchFile);
          expect(patchOk).toBeTruthy();

          const { getCompilationErrors } = await createProgram(projectDirectory, `
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
        it('should return "any" when patch isnt performed', async () => {
          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory, `
            import { RatesDocument } from './types';
            import { useQuery } from '@apollo/client';
            const result = useQuery(RatesDocument, { variables: { currency: "USD" } });
          `);
          const errors = getCompilationErrors();
          assertTsErrors(errors);
          const type = getIdentifierInferredType('result');
          expect(type).toBe(`QueryResult<any, { currency: string; }>`)
        });

        it('should return valid type when patch is performed', async () => {
          const patchOk = applyPatchFile(baseDir, patchFile);
          expect(patchOk).toBeTruthy();

          const { assertTsErrors, getCompilationErrors, getIdentifierInferredType } = await createProgram(projectDirectory, `
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
          const patchOk = applyPatchFile(baseDir, patchFile);
          expect(patchOk).toBeTruthy();

          const { getCompilationErrors } = await createProgram(projectDirectory, `
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

  testVersion('3.0.0', `@apollo+client+~3.0.0.patch`);
  testVersion('3.0.1', `@apollo+client+~3.0.0.patch`);
  testVersion('3.0.2', `@apollo+client+~3.0.0.patch`);
  testVersion('3.1.0', `@apollo+client+~3.1.0.patch`);
  testVersion('3.1.1', `@apollo+client+~3.1.0.patch`);
})