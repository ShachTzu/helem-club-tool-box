import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const INCREMENT_KNOWLEDGE_PAGE_VIEW_MUTATION = gql`
  mutation IncrementKnowledgePageView($id: String!) {
    incrementKnowledgePageView(id: $id)
  }
`;

/**
 * bumps a page's view counter. deliberately fire-and-forget: a failed count
 * must never surface an error to a reader or block the page from rendering.
 */
export function useIncrementKnowledgePageView() {
  const [mutate] = useMutation<{ incrementKnowledgePageView: boolean | null }>(
    INCREMENT_KNOWLEDGE_PAGE_VIEW_MUTATION
  );

  const incrementView = useCallback(
    (id: string) => {
      mutate({ variables: { id } }).catch(() => {
        // counting a view is best-effort telemetry, not part of the read path.
      });
    },
    [mutate]
  );

  return { incrementView };
}
