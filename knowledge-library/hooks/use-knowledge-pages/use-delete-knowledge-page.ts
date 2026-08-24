import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const DELETE_KNOWLEDGE_PAGE_MUTATION = gql`
  mutation DeleteKnowledgePage($id: String!) {
    deleteKnowledgePage(id: $id)
  }
`;

/**
 * deletes a knowledge-library page. does not touch its children — see the
 * repository's deletePage docs for why an orphaned child is preferred over a
 * silent bulk delete.
 */
export function useDeleteKnowledgePage() {
  const [mutate, results] = useMutation<{ deleteKnowledgePage: boolean | null }>(DELETE_KNOWLEDGE_PAGE_MUTATION);

  const deletePage = async (id: string) => {
    const result = await mutate({ variables: { id } });
    return Boolean(result.data?.deleteKnowledgePage);
  };

  return {
    deletePage,
    loading: results.loading,
    error: results.error?.message,
  };
}
