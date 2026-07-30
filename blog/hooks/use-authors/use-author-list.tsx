import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Author, type PlainAuthor } from '@helemclub/blog.entities.author';

/**
 * GraphQL query listing all blog authors.
 */
export const LIST_AUTHORS_QUERY = gql`
  query ListAuthors {
    listAuthors {
      id
      userId
      name
      bio
      photo
      hasWritePermission
      postCount
      lastPostDate
    }
  }
`;

type ListAuthorsData = {
  listAuthors: PlainAuthor[] | null;
};

export type UseAuthorListOptions = {
  /**
   * provide mock data for the author list to bypass the GraphQL query,
   * useful for tests and previews.
   */
  mockData?: PlainAuthor[];
};

export type UseAuthorListValue = {
  /**
   * the list of blog authors.
   */
  authors: Author[];

  /**
   * whether the author list query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the author list query, if any.
   */
  error?: Error;

  /**
   * re-fetches the author list from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches the list of blog authors. accepts optional mock data to skip the
 * network request entirely, used for tests and previews.
 */
export function useAuthorList(options?: UseAuthorListOptions): UseAuthorListValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<ListAuthorsData>(LIST_AUTHORS_QUERY, {
    skip: hasMock,
  });

  const authors = useMemo(() => {
    if (hasMock) {
      return (options?.mockData || []).map(Author.from);
    }
    return (data?.listAuthors || []).map(Author.from);
  }, [hasMock, options?.mockData, data]);

  return {
    authors,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
