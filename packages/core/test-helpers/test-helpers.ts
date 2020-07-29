import * as ts from 'typescript';
import { generate } from '@graphql-codegen/cli';
import { Types } from '@graphql-codegen/plugin-helpers';
import { join } from 'path';

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

export async function createProgram(fileContent: string, compilerOptions: ts.CompilerOptions = {}) {
  const codegenOutput = await executeCodegen();
  const testFileName = 'test.ts';
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2015,
    strict: true,
    noEmit: true,
    alwaysStrict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    strictBindCallApply: true,
    noImplicitThis: true,
    noImplicitReturns: true,
    esModuleInterop: true,
    suppressOutputPathCheck: false,
    ...compilerOptions,
  };
  const compilerHost = ts.createCompilerHost(options);
  const originalGetSourceFile = compilerHost.getSourceFile;
  const originalFileExists = compilerHost.fileExists;

  compilerHost.fileExists = fileName => {
    if (fileName === testFileName) {
      return true;
    }

    const generatedFile = codegenOutput.find(r => join(process.cwd(), r.filename) === fileName);

    if (generatedFile) {
      return true;
    }

    return originalFileExists.call(compilerHost, fileName);
  };

  compilerHost.getSourceFile = fileName => {
    if (fileName === testFileName) {
      return ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.ES2015, true);
    }

    const generatedFile = codegenOutput.find(r => join(process.cwd(), r.filename) === fileName);

    if (generatedFile) {
      return ts.createSourceFile(fileName, generatedFile.content, ts.ScriptTarget.ES2015, true); 
    }

    return originalGetSourceFile.call(compilerHost, fileName);
  };

  const program = ts.createProgram([testFileName], options, compilerHost);

  return {
    program,
    getCompilationErrors: () => {
      const emitResult = program.emit();

      return ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    },
    getIdentifierInferredType: (name: string): string | null => {
      const typeChecker = program.getTypeChecker();
      const file =  program.getSourceFile(testFileName);
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