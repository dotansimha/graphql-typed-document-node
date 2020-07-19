import { buildSchema, execute } from 'graphql';
import { ratesQuery } from './typed-document-nodes';
import { readFileSync } from 'fs';

const schema = buildSchema(readFileSync('./schema.graphql', 'utf-8'));

async function main(): Promise<void> {
  // We are using the regular `execute` from `graphql` library, and we loaded an overloading
  // module using `tsconfig.json` => compilerOptions.types. This makes sure to add support for 
  // the new TypedDocumentNode.
  const result = await execute({
    document: ratesQuery, // This is the TypedDocumentNode containting the result type
    schema,
    variableValues: {
      currency: 'USD'
    }
  });

  // We now have types support and auto complete for the
  // result type, just by passing `ratesQuery` as `document` to execute function.
  const rates = result.data.rates;
  const currency = rates[0].rate; 
}

