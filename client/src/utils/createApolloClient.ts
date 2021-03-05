import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { PaginatedPost } from '../generated/graphql';

const httpLink = createUploadLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    console.error('[networkError]', (networkError as any).result);
  }
});

export function createApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getPosts: {
              // Don't cache separate results based on
              // any of this field's arguments.
              keyArgs: [],
              // Concatenate the incoming list items with
              // the existing list items.
              merge(existing: PaginatedPost, incoming: PaginatedPost) {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });
}
