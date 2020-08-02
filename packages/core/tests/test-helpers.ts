import * as ts from 'typescript';
import { generate } from '@graphql-codegen/cli';
import { Types } from '@graphql-codegen/plugin-helpers';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { dirSync } from 'tmp';
import { execSync } from 'child_process';

const rootPackageFile = require(join(process.cwd(), './package.json'));
const allDeps = {
  ...(rootPackageFile.dependencies || {}),
  ...(rootPackageFile.devDependencies || {}),
};
let cachedCodegenResult: Types.FileOutput[] | null = null;

export async function executeCodegen(): Promise<Types.FileOutput[]> {
  if (!cachedCodegenResult) {
    try {
      cachedCodegenResult = await generate({
        schema: join(__dirname, '../../../examples/graphql/schema.graphql'),
        documents: join(__dirname, '../../../examples/graphql/query.graphql'),
        generates: {
          'types.ts': {
            plugins: [
              'typescript',
              'typescript-operations',
              'typed-document-node',
            ]
          }
        }
      }, false);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);

      throw e;
    }
  }

  return cachedCodegenResult;
}

export async function createProgram(baseDir: string, fileContent: string, compilerOptions: ts.CompilerOptions = {}) {
  const codegenOutput = await executeCodegen();
  const testFilePath = join(baseDir, 'test.ts');
  writeFileSync(join(baseDir, 'types.ts'), codegenOutput[0].content);
  writeFileSync(testFilePath, fileContent);

  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ES2015,
    strict: true,
    noEmit: true,
    alwaysStrict: true,
    lib: ["lib.es2015.d.ts", "lib.esnext.d.ts", "lib.es6.d.ts", "lib.dom.d.ts"],
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    strictBindCallApply: true,
    noImplicitThis: true,
    noImplicitReturns: true,
    esModuleInterop: true,
    rootDir: baseDir,
    ...compilerOptions,
  };
  const compilerHost = ts.createCompilerHost(options);
  const program = ts.createProgram([testFilePath], options, compilerHost);

  return {
    program,
    getCompilationErrors: () => {
      const emitResult = program.emit();

      return ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    },
    getIdentifierInferredType: (name: string): string | null => {
      const typeChecker = program.getTypeChecker();
      const file = program.getSourceFile(testFilePath);
      let found: string | null = null;

      function visit(node: ts.Node) {
        if (ts.isIdentifier(node) && node.escapedText === name) {
          const type = typeChecker.getTypeAtLocation(node.parent);

          if (type) {
            found = typeChecker.typeToString(type, node);
          }
        } else {
          ts.forEachChild(node, child => visit(child));
        }
      }

      ts.forEachChild(file, node => visit(node));

      return found;
    },
    assertTsErrors: (diagnosticsErrors: readonly ts.Diagnostic[]) => {
      expect(diagnosticsErrors).toBeDefined();
      expect(Array.isArray(diagnosticsErrors)).toBeTruthy();

      if (diagnosticsErrors.length > 0) {
        for (const error of diagnosticsErrors) {
          // eslint-disable-next-line
          console.error(ts.formatDiagnostic(error, compilerHost));
        }
      }

      expect(diagnosticsErrors.length).toBe(0);
    }
  }
}

export function prepareTempProject(extraDeps = {}): { dir: string, patch: () => void } {
  const projectDirectory = dirSync();

  writeFileSync(join(projectDirectory.name, './package.json'), JSON.stringify({
    name: "test",
    dependencies: {
      '@types/react': 'latest',
      '@types/node': allDeps['@types/node'],
      'graphql': allDeps.graphql,
      '@graphql-typed-document-node/core': join(process.cwd(), './packages/core/dist/'),
      ...extraDeps,
    },
    scripts: {
      patch: "patch-typed-document-node" 
    }
  }, null, 2));

  execSync('yarn install', {
    stdio: ['ignore', 'ignore', 'ignore'],
    cwd: projectDirectory.name,
  });

  return {
    dir: projectDirectory.name,
    patch: () => {
      const out = execSync('yarn patch', {
        cwd: projectDirectory.name,
      });
      // eslint-disable-next-line
      console.log(out.toString());
    }
  };
}