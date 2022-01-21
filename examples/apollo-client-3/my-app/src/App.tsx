import React from 'react';
import { useQuery } from '@apollo/client'
// this is a test to show that we can import value from outside of react folder
import { OUT_OF_SCOPE } from '../../testConstants'
import { RatesDocument } from '../../typed-document-nodes'

function App() {
  // this is causing the build error
  const result = useQuery(RatesDocument, {
    variables: {
      currency: 'USD'
    }
  });

  return (
    <div>
      <div>{OUT_OF_SCOPE}</div>
      { result && (
        <div>
          {result.data?.rates}
        </div>
      )}
    </div>
  );
}

export default App;
