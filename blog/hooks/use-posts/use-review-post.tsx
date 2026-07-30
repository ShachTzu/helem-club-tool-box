import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL mutation reviewing (approving or rejecting) a pending post.
 */
export const REVIEW_POST_MUTATION = gql`
  mutation ReviewPost($id: ID!, $action: String!) {
    reviewPost(id: $id, action: $action) {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type ReviewPostData = {
  reviewPost: PlainPost | null;
};

export type ReviewPostAction = 'approve' | 'reject';

export type UseReviewPostValue = {
  /**
   * reviews a pending post with the given action. resolves with the
   * reviewed post, or undefined when the review failed.
   */
  reviewPost: (id: string, action: ReviewPostAction) => Promise<Post | undefined>;

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
 * reviews a pending blog post submission, approving or rejecting it.
 * intended for moderators.
 */
export function useReviewPost(): UseReviewPostValue {
  const [mutate, { loading, error }] = useMutation<ReviewPostData>(REVIEW_POST_MUTATION);

  const reviewPost = async (id: string, action: ReviewPostAction) => {
    const result = await mutate({ variables: { id, action } });
    return result.data?.reviewPost ? Post.from(result.data.reviewPost) : undefined;
  };

  return { reviewPost, loading, error };
}
