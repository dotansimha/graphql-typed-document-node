import { ratesQuery } from './typed-document-nodes';
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

async function main(): Promise<void> {
  // EXAMPLE #1: Using the ApolloClient directly
  const client = new ApolloClient({
    cache: new InMemoryCache(),
  });

  // We are using the regular `ApolloClient`, and we loaded an overloading
  // module using `tsconfig.json` => compilerOptions.types. This makes sure to add support for 
  // the new TypedDocumentNode.
  const result = await client.query({
    query: ratesQuery,
    variables: {
      currency: "USD"
    }
  })

  // EXAMPLE #2: Using the useQuery hook
  const hookResult = useQuery(ratesQuery, { variables: {
    currency: "USD"
  }});

  // We now have types support and auto complete for the
  // result type, just by passing `ratesQuery` as `query` to apollo client.
  const rates = hookResult.data.rates;
  const currency = rates[0].rate;
}

