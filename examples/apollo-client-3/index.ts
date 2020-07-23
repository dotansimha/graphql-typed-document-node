/* eslint-disable */
import { RatesDocument } from './typed-document-nodes';
import { useQuery } from '@apollo/client';

// We now have types support and auto complete for the
// result type, just by passing `RatesDocument` as `query` to apollo client.
const result = useQuery(RatesDocument, {
  variables: {
    currency: "USD",
  },
});

const rates = result.data.rates;
const currency = rates[0].rate;
