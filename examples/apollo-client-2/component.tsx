/* eslint-disable */
import * as React from 'react';
import { RatesDocument } from './typed-document-nodes';
import { Query } from 'react-apollo';

const MyComponent: React.FC = () => {
  return (
    <div>
      <Query query={RatesDocument} variables={{ currency: 'ILS' }}>
        {
          ({ data }) => {
            return <span>{data?.rates[0].rate}</span>;
          }
        }
      </Query>
    </div>
  )
}
