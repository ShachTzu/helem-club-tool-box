import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL mutation updating an existing blog post.
 */
export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: ID!, $options: UpdatePostOptions) {
    updatePost(id: $id, options: $options) {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type UpdatePostData = {
  updatePost: PlainPost | null;
};

export type UpdatePostInput = {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  body?: string;
  domains?: string[];
  embeddedApps?: string[];
  visibility?: string;
  metaDescription?: string;
};

export type UseUpdatePostValue = {
  /**
   * updates an existing post by id. resolves with the updated post, or
   * undefined when the update failed.
   */
  updatePost: (id: string, input: UpdatePostInput) => Promise<Post | undefined>;

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
 * updates an existing blog post's fields.
 */
export function useUpdatePost(): UseUpdatePostValue {
  const [mutate, { loading, error }] = useMutation<UpdatePostData>(UPDATE_POST_MUTATION);

  const updatePost = async (id: string, input: UpdatePostInput) => {
    const result = await mutate({ variables: { id, options: input } });
    return result.data?.updatePost ? Post.from(result.data.updatePost) : undefined;
  };

  return { updatePost, loading, error };
}
