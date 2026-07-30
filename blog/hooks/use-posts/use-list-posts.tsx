import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Post, type PlainPost } from '@helemclub/blog.entities.post';
import { BLOG_POST_FIELDS } from './post-fields.fragment.js';

/**
 * GraphQL query listing posts, optionally filtered by domain ids and a
 * free-text query, with pagination.
 */
export const LIST_POSTS_QUERY = gql`
  query ListPosts($options: ListPostsOptions) {
    listPosts(options: $options) {
      ...BlogPostFields
    }
  }
  ${BLOG_POST_FIELDS}
`;

type ListPostsData = {
  listPosts: (PlainPost | null)[] | null;
};

export type UseListPostsOptions = {
  /**
   * restrict results to posts tagged with any of the given coping-domains.
   */
  domainIds?: string[];

  /**
   * free-text search query matched against post content.
   */
  query?: string;

  /**
   * maximum number of posts to return.
   */
  limit?: number;

  /**
   * number of posts to skip, for pagination.
   */
  offset?: number;

  /**
   * provide mock data to bypass the GraphQL query, useful for tests and
   * previews.
   */
  mockData?: PlainPost[];
};

export type UseListPostsValue = {
  /**
   * the posts returned by the query.
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
   * re-fetches the post list from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * lists blog posts, optionally filtered by coping-domain ids and a
 * free-text query. accepts optional mock data to skip the network request
 * entirely, used for tests and previews.
 */
export function useListPosts(options?: UseListPostsOptions): UseListPostsValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<ListPostsData>(LIST_POSTS_QUERY, {
    variables: {
      options: {
        domainIds: options?.domainIds,
        query: options?.query,
        limit: options?.limit,
        offset: options?.offset,
      },
    },
    skip: hasMock,
    // refetch on the client even when SSR produced no/errored data, so a
    // backend that was still seeding at SSR time still populates the list.
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  const posts = useMemo(() => {
    if (hasMock) return (options?.mockData || []).map(Post.from);
    return (data?.listPosts || []).filter((post): post is PlainPost => Boolean(post)).map(Post.from);
  }, [hasMock, options?.mockData, data]);

  return {
    posts,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
