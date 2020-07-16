import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { pascalCase } from 'change-case';
import { OperationDefinitionNode, parse } from 'graphql';

export const plugin: PluginFunction = (schema, docsSources) => {
  return {
    prepend: [`import { TypedDocumentNode } from '@graphql-typed-document-node/core';`],
    content: docsSources.map(docFile => {
      const operation = docFile.document.definitions[0] as OperationDefinitionNode;
      const resultTypeName = pascalCase(operation.name.value) + pascalCase(operation.operation);
      const variablesTypeName = pascalCase(operation.name.value) + pascalCase(operation.operation) + 'Variables';
      
      return `export const ${operation.name.value}${pascalCase(operation.operation)}: TypedDocumentNode<${resultTypeName}, ${variablesTypeName}> = ${JSON.stringify(parse(docFile.rawSDL, { noLocation: true }))};`
    }).join('\n'),
  };
}