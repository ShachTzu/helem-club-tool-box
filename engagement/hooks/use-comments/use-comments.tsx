import { useCallback, useMemo } from 'react';
import { useAuth, type UseAuthOptions } from '@helemclub/platform.hooks.use-auth';
import { useDeviceId } from '@helemclub/platform.hooks.use-device-id';
import { Comment, type PlainComment } from '@helemclub/engagement.entities.comment';
import { useListComments } from './use-list-comments.js';
import { useAddComment } from './use-add-comment.js';
import { useReportComment } from './use-report-comment.js';
import { filterVisibleComments } from './filter-visible-comments.js';

export type UseCommentsOptions = {
  /**
   * provide mock comments to bypass the GraphQL query, useful for tests and previews.
   */
  mockComments?: PlainComment[];

  /**
   * provide mock data for the current user, useful for tests and previews.
   * pass null to simulate a signed-out viewer.
   */
  mockUser?: UseAuthOptions['mockData'];

  /**
   * override the generated/persisted device id, useful for tests and previews.
   */
  mockDeviceId?: string;
};

export type AddCommentValues = {
  /**
   * the comment body text.
   */
  text: string;

  /**
   * post the comment anonymously instead of under the member's display name.
   */
  isAnonymous?: boolean;

  /**
   * restrict visibility of the comment to members only.
   */
  membersOnly?: boolean;
};

export type UseCommentsValue = {
  /**
   * comments visible to the current viewer: hidden comments are always
   * excluded, and members-only comments are excluded for non-members.
   */
  comments: Comment[];

  /**
   * whether the comments are still being resolved.
   */
  loading: boolean;

  /**
   * error raised while resolving or mutating comments, if any.
   */
  error?: Error;

  /**
   * whether the current viewer is a signed-in member, and may therefore
   * see members-only comments and post under their own name.
   */
  isMember: boolean;

  /**
   * posts a new comment against the target. anonymous, un-authenticated
   * viewers may still comment (scoped by device id) unless posting as a
   * named member is requested without being signed in.
   */
  addComment: (values: AddCommentValues) => Promise<Comment | undefined>;

  /**
   * whether a comment is currently being posted.
   */
  addingComment: boolean;

  /**
   * reports a comment as inappropriate. resolves with whether the comment
   * was hidden as a result of this report.
   */
  reportComment: (commentId: string) => Promise<boolean>;

  /**
   * whether a report is currently being submitted.
   */
  reportingComment: boolean;

  /**
   * re-fetches the comments from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * manages the comment thread for a given target (e.g. an app, blog post or
 * domain). lists comments visible to the current viewer, filtering out
 * hidden and members-only comments for non-members, and exposes actions to
 * post a comment (anonymously, under a device id, or as a named member) and
 * to report a comment as inappropriate. relies on useAuth to resolve the
 * current member and useDeviceId to scope anonymous engagement.
 */
export function useComments(
  targetType: string,
  targetId: string,
  options?: UseCommentsOptions
): UseCommentsValue {
  const { user } = useAuth(
    options && Object.prototype.hasOwnProperty.call(options, 'mockUser')
      ? { mockData: options.mockUser }
      : undefined
  );
  const deviceId = useDeviceId({ mockDeviceId: options?.mockDeviceId });

  const {
    comments: allComments,
    loading: listLoading,
    error: listError,
    refetch,
  } = useListComments(targetType, targetId, { mockData: options?.mockComments });

  const { addComment: addCommentMutation, loading: addingComment, error: addError } = useAddComment();
  const {
    reportComment: reportCommentMutation,
    loading: reportingComment,
    error: reportError,
  } = useReportComment();

  const isMember = Boolean(user);

  // in mock mode (tests/previews) no Apollo mutations are wired, so mutations
  // must resolve locally instead of hitting the (unmocked) network.
  const isMock = options?.mockComments !== undefined;

  const comments = useMemo(() => filterVisibleComments(allComments, isMember), [allComments, isMember]);

  const addComment = useCallback(
    async (values: AddCommentValues) => {
      const displayName = !values.isAnonymous && user ? user.displayName : undefined;

      if (isMock) {
        return Comment.from({
          id: `mock-${Date.now()}`,
          targetType,
          targetId,
          text: values.text,
          displayName,
          isAnonymous: Boolean(values.isAnonymous) || !user,
          membersOnly: Boolean(values.membersOnly),
          createdAt: new Date().toISOString(),
        });
      }

      const created = await addCommentMutation({
        targetType,
        targetId,
        text: values.text,
        displayName,
        isAnonymous: Boolean(values.isAnonymous) || !user,
        membersOnly: Boolean(values.membersOnly),
        deviceId,
      });

      if (created) await refetch();
      return created;
    },
    [isMock, addCommentMutation, targetType, targetId, user, deviceId, refetch]
  );

  const reportComment = useCallback(
    async (commentId: string) => {
      if (isMock) return false;
      const hidden = await reportCommentMutation(commentId, deviceId);
      if (hidden) await refetch();
      return hidden;
    },
    [isMock, reportCommentMutation, deviceId, refetch]
  );

  const error = listError || addError || reportError;

  return {
    comments,
    loading: listLoading,
    error,
    isMember,
    addComment,
    addingComment,
    reportComment,
    reportingComment,
    refetch,
  };
}
