import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const ME_CAN_MANAGE_KNOWLEDGE_LIBRARY_QUERY = gql`
  query MeCanManageKnowledgeLibrary {
    meCanManageKnowledgeLibrary
  }
`;

export type UseCanManageKnowledgeLibraryOptions = {
  mockCanManage?: boolean;
};

/**
 * self-check: can the signed-in caller manage knowledge-library content?
 * true for staff (moderator/admin) or an allowlisted editor — the admin UI
 * uses this to gate itself for an editor who isn't staff, since
 * ProtectedRoute's `allowedRoles` only understands the shared role enum.
 */
export function useCanManageKnowledgeLibrary(options?: UseCanManageKnowledgeLibraryOptions) {
  const hasMock = options?.mockCanManage !== undefined;

  const { data, loading, error } = useQuery<{ meCanManageKnowledgeLibrary: boolean }>(
    ME_CAN_MANAGE_KNOWLEDGE_LIBRARY_QUERY,
    { skip: hasMock }
  );

  return {
    canManage: hasMock ? Boolean(options?.mockCanManage) : Boolean(data?.meCanManageKnowledgeLibrary),
    loading: hasMock ? false : loading,
    error: error?.message,
  };
}
