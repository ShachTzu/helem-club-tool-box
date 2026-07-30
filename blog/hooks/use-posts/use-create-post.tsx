import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL mutation creating a new blog post.
 */
export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($options: CreatePostOptions) {
    createPost(options: $options) {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type CreatePostData = {
  createPost: PlainPost | null;
};

export type CreatePostInput = {
  title: string;
  excerpt: string;
  coverImage?: string;
  body: string;
  domains?: string[];
  embeddedApps?: string[];
  visibility?: string;
  metaDescription?: string;
};

export type UseCreatePostValue = {
  /**
   * creates a new post. resolves with the created post, or undefined when
   * creation failed.
   */
  createPost: (input: CreatePostInput) => Promise<Post | undefined>;

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
 * creates a new blog post, authored by the currently signed-in writer.
 */
export function useCreatePost(): UseCreatePostValue {
  const [mutate, { loading, error }] = useMutation<CreatePostData>(CREATE_POST_MUTATION);

  const createPost = async (input: CreatePostInput) => {
    const result = await mutate({ variables: { options: input } });
    return result.data?.createPost ? Post.from(result.data.createPost) : undefined;
  };

  return { createPost, loading, error };
}
