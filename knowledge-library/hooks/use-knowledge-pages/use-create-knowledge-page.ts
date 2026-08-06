import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.entities.knowledge-page';

export type CreateKnowledgePageInput = {
  title: string;
  body: string;
  parentId?: string | null;
  domains?: string[];
  image?: string;
  videoUrl?: string;
  videoEmbedHtml?: string;
  publishDate?: string;
  isPublished?: boolean;
};

export const CREATE_KNOWLEDGE_PAGE_MUTATION = gql`
  mutation CreateKnowledgePage($options: KnowledgeLibraryCreatePageOptions!) {
    createKnowledgePage(options: $options) {
      id
      slug
      title
      parentId
    }
  }
`;

/**
 * creates a new knowledge-library page.
 */
export function useCreateKnowledgePage() {
  const [mutate, results] = useMutation<{ createKnowledgePage: PlainKnowledgePage }>(CREATE_KNOWLEDGE_PAGE_MUTATION);

  const createPage = async (input: CreateKnowledgePageInput) => {
    const result = await mutate({ variables: { options: input } });
    return result.data?.createKnowledgePage;
  };

  return {
    createPage,
    loading: results.loading,
    error: results.error?.message,
  };
}
