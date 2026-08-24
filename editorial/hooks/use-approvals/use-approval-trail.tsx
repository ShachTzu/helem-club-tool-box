import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ApprovalEntry, type PlainApprovalEntry } from '@helemclub/editorial.entities.approval-entry';

/**
 * GraphQL query fetching the full approval trail of a draft — an
 * append-only audit log of who did what, and when.
 */
export const LIST_APPROVAL_TRAIL_QUERY = gql`
  query ListApprovalTrail($draftId: ID) {
    listApprovalTrail(draftId: $draftId) {
      id
      draftId
      action
      actorId
      actorName
      actorRole
      note
      fromStatus
      toStatus
      versionNumber
      createdAt
    }
  }
`;

type ListApprovalTrailData = {
  listApprovalTrail: PlainApprovalEntry[] | null;
};

export type UseApprovalTrailOptions = {
  /**
   * provide mock approval entries, bypassing the network request entirely.
   * useful for tests and compositions.
   */
  mockData?: PlainApprovalEntry[];
};

export type UseApprovalTrailValue = {
  /**
   * the full approval trail of the draft, ordered as returned by the
   * server — a log of who did what, and when.
   */
  entries: ApprovalEntry[];

  /**
   * whether the approval trail is still loading.
   */
  loading: boolean;

  /**
   * error message, in Hebrew, when the trail failed to load.
   */
  error?: string;
};

/**
 * fetches the full approval trail (audit log) of a draft: every submission,
 * decision and publish action, along with who performed it and when.
 */
export function useApprovalTrail(draftId: string, options?: UseApprovalTrailOptions): UseApprovalTrailValue {
  const hasMock = options !== undefined && Object.prototype.hasOwnProperty.call(options, 'mockData');
  const mockData = options?.mockData;

  const { data, loading, error } = useQuery<ListApprovalTrailData>(LIST_APPROVAL_TRAIL_QUERY, {
    variables: { draftId },
    skip: hasMock || !draftId,
  });

  const rawEntries = hasMock ? mockData : data?.listApprovalTrail;

  const entries = useMemo(() => {
    return (rawEntries || []).map((entry) => ApprovalEntry.from(entry));
  }, [rawEntries]);

  return {
    entries,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error ? 'אירעה שגיאה בטעינת יומן הביקורת.' : undefined,
  };
}
