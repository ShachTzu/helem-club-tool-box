import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export type ImportRowInput = {
  text?: string;
  imageFilename?: string;
  videoHtmlEmbed?: string;
  videoUrl?: string;
  date?: string;
  currentPageTitle: string;
  currentPageUrl?: string;
  parentPageTitle?: string;
};

export type ImageMappingInput = { filename: string; url: string };

export type ImportSummaryResult = {
  createdPageIds: string[];
  matchedExistingParents: string[];
  createdParents: string[];
  rejected: { currentPageTitle: string; reason: string }[];
};

export const IMPORT_KNOWLEDGE_PAGES_MUTATION = gql`
  mutation ImportKnowledgeLibraryPages(
    $rows: [KnowledgeLibraryImportRow!]!
    $images: [KnowledgeLibraryImageMapping!]
    $topAnchorParentId: String
  ) {
    importKnowledgeLibraryPages(rows: $rows, images: $images, topAnchorParentId: $topAnchorParentId) {
      createdPageIds
      matchedExistingParents
      createdParents
      rejected {
        currentPageTitle
        reason
      }
    }
  }
`;

/**
 * bulk-imports a CSV-derived batch of rows as knowledge-library pages,
 * anchored under an optional top-level parent for the whole batch.
 */
export function useImportKnowledgePages() {
  const [mutate, results] = useMutation<{ importKnowledgeLibraryPages: ImportSummaryResult }>(
    IMPORT_KNOWLEDGE_PAGES_MUTATION
  );

  const importPages = async (
    rows: ImportRowInput[],
    images: ImageMappingInput[],
    topAnchorParentId: string | null
  ) => {
    const result = await mutate({ variables: { rows, images, topAnchorParentId } });
    return result.data?.importKnowledgeLibraryPages;
  };

  return {
    importPages,
    loading: results.loading,
    error: results.error?.message,
  };
}
