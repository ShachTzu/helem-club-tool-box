import { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { SearchResult, type PlainSearchResult, type SearchResultType } from '@helemclub/platform.entities.search-result';

const SEARCH_QUERY = gql`
  query PlatformSearch($options: PlatformSearchOptions!) {
    search(options: $options) {
      id
      type
      title
      excerpt
      url
      imageUrl
      domains
    }
  }
`;

const DEFAULT_DEBOUNCE_MS = 300;

export type UseSearchOptions = {
  /**
   * restrict the search to specific content types (e.g. 'app', 'blog', 'event').
   */
  types?: string[];

  /**
   * restrict search results to a specific coping domain.
   */
  domainId?: string;

  /**
   * maximum number of results to return.
   */
  limit?: number;

  /**
   * debounce delay, in milliseconds, applied to the query before it is sent to the
   * platform search aspect. defaults to 300ms.
   */
  debounceMs?: number;

  /**
   * provide mock search results, bypassing the network request entirely. useful for
   * tests and compositions.
   */
  mockData?: SearchResult[];
};

export type UseSearchValue = {
  /**
   * flat list of matching search results, ordered as returned by the search aspect.
   */
  results: SearchResult[];

  /**
   * search results grouped by their content type (e.g. 'app', 'blog', 'event').
   */
  groupedResults: Record<string, SearchResult[]>;

  /**
   * whether the debounced query is currently loading results.
   */
  loading: boolean;

  /**
   * error message, if the search request failed.
   */
  error?: string;

  /**
   * true once a non-empty query has resolved with no matching results.
   */
  isEmpty: boolean;

  /**
   * re-runs the search query against the platform aspect.
   */
  refetch: () => void;
};

/**
 * debounces a value, only updating the returned value once the given delay has
 * elapsed without further changes.
 */
function useDebouncedValue(value: string, delayMs: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * groups a flat list of search results by their content type.
 */
function groupByType(results: SearchResult[]): Record<string, SearchResult[]> {
  return results.reduce((groups, result) => {
    const existing = groups[result.type] || [];
    return { ...groups, [result.type]: [...existing, result] };
  }, {} as Record<string, SearchResult[]>);
}

/**
 * debounced, global cross-content search against the platform aspect. searches
 * across every registered content type (apps, blog posts, events, gallery items,
 * knowledge articles, community wisdom and coping domains) and returns the
 * matching results grouped by their content type, along with loading and empty
 * states.
 */
export function useSearch(query: string, options?: UseSearchOptions): UseSearchValue {
  const { types, domainId, limit, debounceMs = DEFAULT_DEBOUNCE_MS, mockData } = options || {};
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, debounceMs);
  const hasQuery = debouncedQuery.length > 0;

  const queryResult = useQuery<{ search: PlainSearchResult[] }>(SEARCH_QUERY, {
    variables: {
      options: {
        query: debouncedQuery,
        types,
        domainId,
        limit,
      },
    },
    skip: Boolean(mockData) || !hasQuery,
  });

  const data = mockData ? { search: mockData.map((result) => result.toObject()) } : queryResult.data;
  const loading = mockData ? false : queryResult.loading;
  const errorMessage = mockData ? undefined : queryResult.error?.message;

  const results = useMemo(() => {
    if (!data?.search) return [];
    return data.search.map((plainResult) => SearchResult.from(plainResult));
  }, [data]);

  const groupedResults = useMemo(() => groupByType(results), [results]);

  const refetch = () => {
    if (mockData) return;
    queryResult.refetch();
  };

  return {
    results,
    groupedResults,
    loading: hasQuery && loading,
    error: errorMessage,
    isEmpty: hasQuery && !loading && results.length === 0,
    refetch,
  };
}

export type { SearchResultType };
