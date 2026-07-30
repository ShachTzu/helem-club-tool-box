import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL query fetching a single post by its slug.
 */
export const GET_POST_QUERY = gql`
  query GetPost($slug: String!) {
    getPost(slug: $slug) {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type GetPostData = {
  getPost: PlainPost | null;
};

export type UseGetPostOptions = {
  /**
   * provide mock data to bypass the GraphQL query, useful for tests and
   * previews. pass null to simulate a post that was not found.
   */
  mockData?: PlainPost | null;
};

export type UseGetPostValue = {
  /**
   * the resolved post, or null when not found.
   */
  post: Post | null;

  /**
   * whether the query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the query, if any.
   */
  error?: Error;

  /**
   * re-fetches the post from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches a single blog post by slug. accepts optional mock data to skip
 * the network request entirely, used for tests and previews.
 */
export function useGetPost(slug: string, options?: UseGetPostOptions): UseGetPostValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<GetPostData>(GET_POST_QUERY, {
    variables: { slug },
    skip: hasMock || !slug,
  });

  const post = useMemo(() => {
    if (hasMock) return options?.mockData ? Post.from(options.mockData) : null;
    return data?.getPost ? Post.from(data.getPost) : null;
  }, [hasMock, options?.mockData, data]);

  return {
    post,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
