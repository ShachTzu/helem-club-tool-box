import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation reporting a comment as inappropriate. the server hides
 * the comment once it accumulates enough reports.
 */
export const REPORT_COMMENT_MUTATION = gql`
  mutation ReportComment($commentId: String!, $deviceId: String!) {
    reportComment(options: { commentId: $commentId, deviceId: $deviceId }) {
      hidden
    }
  }
`;

type ReportCommentData = {
  reportComment: {
    hidden?: boolean;
  } | null;
};

export type UseReportCommentValue = {
  /**
   * reports a comment as inappropriate. resolves with whether the comment
   * was hidden as a result of this report.
   */
  reportComment: (commentId: string, deviceId: string) => Promise<boolean>;

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
 * reports a comment as inappropriate on behalf of a device or member.
 */
export function useReportComment(): UseReportCommentValue {
  const [mutate, { loading, error }] = useMutation<ReportCommentData>(REPORT_COMMENT_MUTATION);

  const reportComment = async (commentId: string, deviceId: string) => {
    const result = await mutate({ variables: { commentId, deviceId } });
    return Boolean(result.data?.reportComment?.hidden);
  };

  return { reportComment, loading, error };
}
