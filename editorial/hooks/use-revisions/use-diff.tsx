import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { FieldDiff } from '@helemclub/editorial.entities.field-diff';

export type UseDiffOptions = {
  /**
   * provide mock field diffs instead of querying the server. useful for
   * tests and compositions.
   */
  mockData?: FieldDiff[];
};

export type UseDiffResult = {
  /**
   * field-level differences between the two requested revisions.
   */
  diffs: FieldDiff[];

  /**
   * whether the diff is currently being fetched.
   */
  loading: boolean;

  /**
   * error message, if the query failed.
   */
  error?: string;
};

type DiffRevisionsQueryResult = {
  diffRevisions: Array<{
    field: string;
    label: string;
    before?: string | null;
    after?: string | null;
    changeKind: string;
  } | null> | null;
};

const DIFF_REVISIONS_QUERY = gql`
  query DiffRevisions($options: DiffRevisionsOptions) {
    diffRevisions(options: $options) {
      field
      label
      before
      after
      changeKind
    }
  }
`;

/**
 * fetches the field-level differences between two revisions of a draft.
 * accepts an optional mockData option that, when provided, skips the network
 * request entirely and returns the given diffs instead — useful for tests
 * and compositions.
 */
export function useDiff(
  draftId: string,
  fromVersion: number,
  toVersion: number,
  options?: UseDiffOptions
): UseDiffResult {
  const { mockData } = options || {};

  const { data, loading, error } = useQuery<DiffRevisionsQueryResult>(DIFF_REVISIONS_QUERY, {
    variables: { options: { draftId, fromVersion, toVersion } },
    skip: !!mockData || !draftId,
  });

  const diffs = useMemo(() => {
    if (mockData) return mockData;

    return (data?.diffRevisions || [])
      .filter((diff): diff is NonNullable<typeof diff> => Boolean(diff))
      .map((diff) =>
        FieldDiff.from({
          field: diff.field,
          label: diff.label,
          before: diff.before ?? undefined,
          after: diff.after ?? undefined,
          changeKind: diff.changeKind as FieldDiff['changeKind'],
        })
      );
  }, [data, mockData]);

  return {
    diffs,
    loading,
    error: error?.message,
  };
}
