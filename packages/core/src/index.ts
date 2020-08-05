import { DocumentNode } from 'graphql';

export interface TypedDocumentNode<Result = { [key: string]: any }, Variables = { [key: string]: any }> extends DocumentNode { }
