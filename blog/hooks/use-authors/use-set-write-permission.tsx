import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Author, type PlainAuthor } from '@helemclub/blog.entities.author';

/**
 * GraphQL mutation setting whether a user has permission to write blog posts.
 */
export const SET_WRITE_PERMISSION_MUTATION = gql`
  mutation SetWritePermission($userId: ID!, $canWrite: Boolean!) {
    setWritePermission(userId: $userId, canWrite: $canWrite) {
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

type SetWritePermissionData = {
  setWritePermission: PlainAuthor | null;
};

export type UseSetWritePermissionValue = {
  /**
   * sets whether the given user has permission to write blog posts. resolves
   * with the updated author, or undefined when the mutation failed.
   */
  setWritePermission: (userId: string, canWrite: boolean) => Promise<Author | undefined>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised by the mutation, if any.
   */
  error?: Error;
};

/**
 * grants or revokes write permission for a blog author. intended for use by
 * admins managing which users may author blog posts.
 */
export function useSetWritePermission(): UseSetWritePermissionValue {
  const [mutate, { loading, error }] = useMutation<SetWritePermissionData>(SET_WRITE_PERMISSION_MUTATION);

  const setWritePermission = async (userId: string, canWrite: boolean) => {
    const result = await mutate({ variables: { userId, canWrite } });
    return result.data?.setWritePermission ? Author.from(result.data.setWritePermission) : undefined;
  };

  return { setWritePermission, loading, error };
}
