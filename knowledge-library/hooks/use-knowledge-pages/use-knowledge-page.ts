import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.entities.knowledge-page';

export const GET_KNOWLEDGE_PAGE_QUERY = gql`
  query GetKnowledgePage($idOrSlug: String!) {
    getKnowledgePage(idOrSlug: $idOrSlug) {
      id
      slug
      title
      body
      parentId
      ancestorIds
      domains
      image
      videoUrl
      videoEmbedHtml
      mediaType
      durationSec
      viewCount
      publishDate
      authorName
      isStaffAuthor
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export type UseKnowledgePageOptions = {
  mockData?: PlainKnowledgePage | null;
};

/**
 * fetches a single knowledge-library page by its id or slug.
 */
export function useKnowledgePage(idOrSlug: string, options?: UseKnowledgePageOptions) {
  const hasMock = options?.mockData !== undefined;
  const skip = hasMock || !idOrSlug;

  const { data, loading, error, refetch } = useQuery<{ getKnowledgePage: PlainKnowledgePage | null }>(
    GET_KNOWLEDGE_PAGE_QUERY,
    { variables: { idOrSlug }, skip }
  );

  const page = useMemo(() => {
    if (hasMock) return options?.mockData || undefined;
    return data?.getKnowledgePage || undefined;
  }, [data, hasMock, options?.mockData]);

  return {
    page,
    loading: skip ? false : loading,
    error: error?.message,
    refetch: () => {
      refetch();
    },
  };
}
