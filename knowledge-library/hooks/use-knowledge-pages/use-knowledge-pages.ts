import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.knowledge-library';

const PAGE_FIELDS = `
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
  publishDate
  authorName
  isStaffAuthor
  isPublished
  createdAt
  updatedAt
`;

export const LIST_KNOWLEDGE_PAGES_QUERY = gql`
  query ListKnowledgePages($options: KnowledgeLibraryListPagesOptions) {
    listKnowledgePages(options: $options) {
      ${PAGE_FIELDS}
    }
  }
`;

export type UseKnowledgePagesOptions = {
  /**
   * list only the direct children of this page. pass null explicitly to list
   * top-level pages. omit to list every page regardless of level.
   */
  parentId?: string | null;

  domainIds?: string[];
  query?: string;
  limit?: number;

  /**
   * provide mock data to bypass the network request, useful for tests and compositions.
   */
  mockData?: PlainKnowledgePage[];
};

export type UseKnowledgePagesResult = {
  pages: PlainKnowledgePage[];
  loading: boolean;
  error?: string;
  refetch: () => void;
};

/**
 * lists and filters knowledge-library pages by parent, coping domains and a
 * free text query.
 */
export function useKnowledgePages(options?: UseKnowledgePagesOptions): UseKnowledgePagesResult {
  const skip = Boolean(options?.mockData);

  const { data, loading, error, refetch } = useQuery<{ listKnowledgePages: PlainKnowledgePage[] }>(
    LIST_KNOWLEDGE_PAGES_QUERY,
    {
      variables: { options: { parentId: options?.parentId, domainIds: options?.domainIds, query: options?.query, limit: options?.limit } },
      skip,
    }
  );

  const pages = useMemo(() => {
    if (options?.mockData) return options.mockData;
    return data?.listKnowledgePages || [];
  }, [data, options?.mockData]);

  return {
    pages,
    loading: skip ? false : loading,
    error: error?.message,
    refetch: () => {
      refetch();
    },
  };
}
