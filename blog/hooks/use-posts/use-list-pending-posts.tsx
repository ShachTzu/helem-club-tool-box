import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL query listing posts awaiting moderation review.
 */
export const LIST_PENDING_POSTS_QUERY = gql`
  query ListPendingPosts {
    listPendingPosts {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type ListPendingPostsData = {
  listPendingPosts: (PlainPost | null)[] | null;
};

export type UseListPendingPostsOptions = {
  /**
   * provide mock data to bypass the GraphQL query, useful for tests and
   * previews.
   */
  mockData?: PlainPost[];
};

export type UseListPendingPostsValue = {
  /**
   * posts awaiting moderation review.
   */
  posts: Post[];

  /**
   * whether the query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the query, if any.
   */
  error?: Error;

  /**
   * re-fetches the pending post list from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * lists blog posts awaiting moderation review, intended for moderators.
 * accepts optional mock data to skip the network request entirely, used
 * for tests and previews.
 */
export function useListPendingPosts(options?: UseListPendingPostsOptions): UseListPendingPostsValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<ListPendingPostsData>(LIST_PENDING_POSTS_QUERY, {
    skip: hasMock,
  });

  const posts = useMemo(() => {
    if (hasMock) return (options?.mockData || []).map(Post.from);
    return (data?.listPendingPosts || []).filter((post): post is PlainPost => Boolean(post)).map(Post.from);
  }, [hasMock, options?.mockData, data]);

  return {
    posts,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
