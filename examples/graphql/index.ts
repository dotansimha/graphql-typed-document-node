import { buildSchema, execute } from 'graphql';
import { RatesDocument } from './typed-document-nodes';
import { readFileSync } from 'fs';

const schema = buildSchema(readFileSync('./schema.graphql', 'utf-8'));

async function main(): Promise<void> {
  // We are using the regular `execute` from `graphql` library, but with patch applied.
  const result = await execute({
    document: RatesDocument, // This is the TypedDocumentNode containting the result type and variables type
    schema,
    variableValues: {
      currency: 'USD'
    }
  });

  result.data.rates

  // We now have types support and auto complete for the
  // result type, just by passing `RatesDocument` as `document` to execute function.
  const rates = result.data.rates;
  const currency = rates[0].rate; 
}

