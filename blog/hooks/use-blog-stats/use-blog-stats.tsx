import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { BlogStats, type PlainBlogStats } from '@helemclub/blog.entities.blog-stat';

/**
 * A time range preset accepted by the blog stats query. Supports either a
 * named preset (e.g. "7d", "30d", "90d", "all") or an explicit from/to range.
 */
export type TimeRange = {
  /**
   * a named preset for the range, for example "7d", "30d", "90d" or "all".
   */
  preset?: string;

  /**
   * ISO date string marking the start of the range.
   */
  from?: string;

  /**
   * ISO date string marking the end of the range.
   */
  to?: string;
};

/**
 * GraphQL query fetching aggregated blog dashboard metrics for a given
 * time range.
 */
export const GET_BLOG_STATS_QUERY = gql`
  query GetBlogStats($range: BlogTimeRangeOptions) {
    getBlogStats(options: { range: $range }) {
      totalPosts
      uniqueVisitors
      totalViews
      comments
      reactions
      saves
      verifiedMembers
      topPosts {
        id
        title
        views
      }
      authors {
        name
        postCount
        lastPostDate
        posts {
          title
          date
        }
      }
    }
  }
`;

type GetBlogStatsData = {
  getBlogStats: PlainBlogStats | null;
};

export type UseBlogStatsOptions = {
  /**
   * provide mock data to bypass the GraphQL query, useful for tests and previews.
   */
  mockData?: PlainBlogStats;
};

export type UseBlogStatsValue = {
  /**
   * the aggregated blog stats for the selected time range, or undefined
   * while loading or when no data was found.
   */
  stats?: BlogStats;

  /**
   * whether the stats query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the stats query, if any.
   */
  error?: Error;

  /**
   * re-fetches the blog stats from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches aggregated dashboard metrics for the blog (posts, views, visitors,
 * top posts, per-author contributions, comments, reactions, saves and
 * verified members) scoped to the given time range.
 */
export function useBlogStats(range?: TimeRange, options?: UseBlogStatsOptions): UseBlogStatsValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<GetBlogStatsData>(GET_BLOG_STATS_QUERY, {
    variables: { range },
    skip: hasMock,
  });

  const stats = useMemo(() => {
    if (hasMock) {
      return options?.mockData ? BlogStats.from(options.mockData) : undefined;
    }
    return data?.getBlogStats ? BlogStats.from(data.getBlogStats) : undefined;
  }, [hasMock, options?.mockData, data]);

  return {
    stats,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
