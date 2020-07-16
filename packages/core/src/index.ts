import { DocumentNode } from 'graphql';

export interface TypedDocumentNode<Result = {}, Variables = {}> extends DocumentNode {}
