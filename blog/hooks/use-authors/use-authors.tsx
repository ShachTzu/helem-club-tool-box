import { useCallback } from 'react';
import { Author, type PlainAuthor } from '@helemclub/blog.entities.author';
import { useAuthorList } from './use-author-list.js';
import { useSetWritePermission } from './use-set-write-permission.js';

export type UseAuthorsOptions = {
  /**
   * provide mock data for the author list to bypass the GraphQL query,
   * useful for tests and previews.
   */
  mockData?: PlainAuthor[];
};

export type UseAuthorsValue = {
  /**
   * the list of blog authors.
   */
  authors: Author[];

  /**
   * whether the author list query is in flight.
   */
  loading: boolean;

  /**
   * error raised while resolving the author list, if any.
   */
  error?: Error;

  /**
   * re-fetches the author list from the server.
   */
  refetch: () => Promise<unknown>;

  /**
   * sets whether the given user has permission to write blog posts. resolves
   * with the updated author, or undefined when the mutation failed. intended
   * for use by admins managing the author roster.
   */
  setWritePermission: (userId: string, canWrite: boolean) => Promise<Author | undefined>;

  /**
   * whether a write-permission mutation is in flight.
   */
  permissionLoading: boolean;

  /**
   * error raised by the write-permission mutation, if any.
   */
  permissionError?: Error;
};

/**
 * manages the list of blog authors and admin control over their write
 * permission. exposes the current author list along with loading/error
 * state, a refetch function, and a setWritePermission action for granting or
 * revoking a user's ability to write blog posts. after a successful
 * permission change, the author list is refetched so consumers see the
 * updated state.
 */
export function useAuthors(options?: UseAuthorsOptions): UseAuthorsValue {
  const { authors, loading, error, refetch } = useAuthorList(options);
  const {
    setWritePermission: setWritePermissionMutation,
    loading: permissionLoading,
    error: permissionError,
  } = useSetWritePermission();

  const setWritePermission = useCallback(
    async (userId: string, canWrite: boolean) => {
      const updatedAuthor = await setWritePermissionMutation(userId, canWrite);
      if (updatedAuthor) {
        await refetch();
      }
      return updatedAuthor;
    },
    [setWritePermissionMutation, refetch]
  );

  return {
    authors,
    loading,
    error,
    refetch,
    setWritePermission,
    permissionLoading,
    permissionError,
  };
}
