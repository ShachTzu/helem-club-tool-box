import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.knowledge-library';

export type UpdateKnowledgePageInput = {
  title?: string;
  body?: string;
  parentId?: string | null;
  domains?: string[];
  image?: string;
  videoUrl?: string;
  videoEmbedHtml?: string;
  publishDate?: string;
  isPublished?: boolean;
};

export const UPDATE_KNOWLEDGE_PAGE_MUTATION = gql`
  mutation UpdateKnowledgePage($id: String!, $options: KnowledgeLibraryUpdatePageOptions!) {
    updateKnowledgePage(id: $id, options: $options) {
      id
      slug
      title
      parentId
    }
  }
`;

/**
 * updates an existing knowledge-library page.
 */
export function useUpdateKnowledgePage() {
  const [mutate, results] = useMutation<{ updateKnowledgePage: PlainKnowledgePage | null }>(
    UPDATE_KNOWLEDGE_PAGE_MUTATION
  );

  const updatePage = async (id: string, input: UpdateKnowledgePageInput) => {
    const result = await mutate({ variables: { id, options: input } });
    return result.data?.updateKnowledgePage;
  };

  return {
    updatePage,
    loading: results.loading,
    error: results.error?.message,
  };
}
