import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Comment, type PlainComment } from '@helemclub/engagement.entities.comment';

/**
 * GraphQL mutation posting a new comment against a target. supports both
 * anonymous (device-scoped) and named (member) comments, as well as
 * marking a comment as visible to members only.
 */
export const ADD_COMMENT_MUTATION = gql`
  mutation AddComment(
    $targetType: String!
    $targetId: String!
    $text: String!
    $displayName: String
    $isAnonymous: Boolean
    $membersOnly: Boolean
    $deviceId: String!
  ) {
    addComment(
      options: {
        targetType: $targetType
        targetId: $targetId
        text: $text
        displayName: $displayName
        isAnonymous: $isAnonymous
        membersOnly: $membersOnly
        deviceId: $deviceId
      }
    ) {
      id
      targetType
      targetId
      text
      displayName
      isAnonymous
      membersOnly
      deviceId
      userId
      reportCount
      hidden
      createdAt
    }
  }
`;

type AddCommentData = {
  addComment: PlainComment | null;
};

export type AddCommentInput = {
  targetType: string;
  targetId: string;
  text: string;
  displayName?: string;
  isAnonymous?: boolean;
  membersOnly?: boolean;
  deviceId: string;
};

export type UseAddCommentValue = {
  /**
   * posts a new comment. resolves with the created comment, or undefined
   * when the mutation failed to return one.
   */
  addComment: (input: AddCommentInput) => Promise<Comment | undefined>;

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
 * posts a new comment against a target. accepts either an anonymous,
 * device-scoped comment or a named comment tied to the current member,
 * and can be flagged as visible to members only.
 */
export function useAddComment(): UseAddCommentValue {
  const [mutate, { loading, error }] = useMutation<AddCommentData>(ADD_COMMENT_MUTATION);

  const addComment = async (input: AddCommentInput) => {
    const result = await mutate({ variables: input });
    return result.data?.addComment ? Comment.from(result.data.addComment) : undefined;
  };

  return { addComment, loading, error };
}
