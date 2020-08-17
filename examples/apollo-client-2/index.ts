/* eslint-disable */
import { RatesDocument } from './typed-document-nodes';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

async function main() {
  // We now have types support and auto complete for the
  // result type, just by passing `RatesDocument` as `query` to apollo client.
  const result = await client.query({
    query: RatesDocument,
    variables: {
      currency: "USD",
    },
  });

  const rates = result.data.rates;
  const currency = rates[0].rate;
}
