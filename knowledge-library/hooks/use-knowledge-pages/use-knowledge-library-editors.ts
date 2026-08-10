import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

export type KnowledgeLibraryEditor = { userId: string; grantedAt: string };

export const LIST_KNOWLEDGE_LIBRARY_EDITORS_QUERY = gql`
  query ListKnowledgeLibraryEditors {
    listKnowledgeLibraryEditors {
      userId
      grantedAt
    }
  }
`;

const GRANT_EDITOR_MUTATION = gql`
  mutation GrantKnowledgeLibraryEditor($userId: String!) {
    grantKnowledgeLibraryEditor(userId: $userId)
  }
`;

const REVOKE_EDITOR_MUTATION = gql`
  mutation RevokeKnowledgeLibraryEditor($userId: String!) {
    revokeKnowledgeLibraryEditor(userId: $userId)
  }
`;

export type UseKnowledgeLibraryEditorsOptions = {
  mockData?: KnowledgeLibraryEditor[];
};

/**
 * lists the knowledge-library editor allowlist and lets an admin grant or
 * revoke access — admin-only, enforced server-side.
 */
export function useKnowledgeLibraryEditors(options?: UseKnowledgeLibraryEditorsOptions) {
  const skip = Boolean(options?.mockData);

  const { data, loading, error, refetch } = useQuery<{ listKnowledgeLibraryEditors: KnowledgeLibraryEditor[] }>(
    LIST_KNOWLEDGE_LIBRARY_EDITORS_QUERY,
    { skip }
  );
  const [grantMutation, grantResult] = useMutation<{ grantKnowledgeLibraryEditor: boolean }>(GRANT_EDITOR_MUTATION);
  const [revokeMutation] = useMutation<{ revokeKnowledgeLibraryEditor: boolean }>(REVOKE_EDITOR_MUTATION);

  const editors = useMemo(() => {
    if (options?.mockData) return options.mockData;
    return data?.listKnowledgeLibraryEditors || [];
  }, [data, options?.mockData]);

  const grantEditor = async (userId: string) => {
    await grantMutation({ variables: { userId } });
    refetch();
  };

  const revokeEditor = async (userId: string) => {
    await revokeMutation({ variables: { userId } });
    refetch();
  };

  return {
    editors,
    loading: skip ? false : loading,
    error: error?.message,
    grantEditor,
    revokeEditor,
    granting: grantResult.loading,
    refetch: () => {
      refetch();
    },
  };
}
