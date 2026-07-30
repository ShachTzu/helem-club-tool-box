import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL mutation submitting a community article for moderation review.
 */
export const SUBMIT_POST_MUTATION = gql`
  mutation SubmitPost($options: SubmitPostOptions) {
    submitPost(options: $options) {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type SubmitPostData = {
  submitPost: PlainPost | null;
};

export type SubmitPostInput = {
  title: string;
  excerpt: string;
  coverImage?: string;
  body: string;
  domains?: string[];
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterFacebook: string;
  displayName?: string;
};

export type UseSubmitPostValue = {
  /**
   * submits a community article for moderation review. resolves with the
   * created (pending) post, or undefined when submission failed.
   */
  submitPost: (input: SubmitPostInput) => Promise<Post | undefined>;

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
 * submits a community-authored article for moderation review. contact
 * details are collected but never shown publicly.
 */
export function useSubmitPost(): UseSubmitPostValue {
  const [mutate, { loading, error }] = useMutation<SubmitPostData>(SUBMIT_POST_MUTATION);

  const submitPost = async (input: SubmitPostInput) => {
    const result = await mutate({ variables: { options: input } });
    return result.data?.submitPost ? Post.from(result.data.submitPost) : undefined;
  };

  return { submitPost, loading, error };
}
