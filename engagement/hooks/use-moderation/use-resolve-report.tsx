import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation resolving a moderation report on a comment, either by
 * restoring the comment to public view or by deleting it permanently.
 */
export const RESOLVE_REPORT_MUTATION = gql`
  mutation ResolveReport($commentId: String!, $action: String!) {
    resolveReport(options: { commentId: $commentId, action: $action })
  }
`;

/**
 * a moderation decision applied to a reported/hidden comment.
 */
export type ModerationAction = 'restore' | 'delete';

type ResolveReportData = {
  resolveReport: boolean | null;
};

export type UseResolveReportValue = {
  /**
   * resolves the report on a comment with the given moderation action.
   * resolves with whether the server confirmed the change.
   */
  resolveReport: (commentId: string, action: ModerationAction) => Promise<boolean>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised by the mutation, if any.
   */
  error?: Error;
};

/**
 * resolves a moderation report on a comment, either restoring it to public
 * view or deleting it permanently. moderator/admin only, enforced server-side.
 */
export function useResolveReport(): UseResolveReportValue {
  const [mutate, { loading, error }] = useMutation<ResolveReportData>(RESOLVE_REPORT_MUTATION);

  const resolveReport = async (commentId: string, action: ModerationAction) => {
    const result = await mutate({ variables: { commentId, action } });
    return Boolean(result.data?.resolveReport);
  };

  return { resolveReport, loading, error };
}
