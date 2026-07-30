import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

/**
 * a single piece of content tagged with one or more knowledge domains,
 * originating from anywhere across the Helam Club ecosystem (apps, posts,
 * records, events, gallery items, etc).
 */
export type TaggedContent = {
  /**
   * the content type provider (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  type: string;

  /**
   * unique identifier of the content item.
   */
  id: string;

  /**
   * display title of the content item.
   */
  title: string;

  /**
   * short excerpt or description of the content item.
   */
  excerpt?: string;

  /**
   * link to the content item.
   */
  url: string;

  /**
   * optional cover/preview image for the content item.
   */
  imageUrl?: string;

  /**
   * ids of the knowledge domains this content is tagged with.
   */
  domains: string[];
};

type PlainTaggedContent = {
  type?: string;
  id?: string;
  title?: string;
  excerpt?: string;
  url?: string;
  imageUrl?: string;
  domains?: string[];
};

/**
 * options for the useDomainContent hook.
 */
export type UseDomainContentOptions = {
  /**
   * restrict the results to specific content types (e.g. ['post', 'event']).
   * when omitted, content across all registered content types is returned.
   */
  types?: string[];

  /**
   * maximum number of content items to return.
   */
  limit?: number;

  /**
   * number of content items to skip, for pagination.
   */
  offset?: number;

  /**
   * provide mock content data instead of querying the ecosystem. when set,
   * the underlying query is skipped entirely.
   */
  mockData?: TaggedContent[];
};

/**
 * the shape returned by the useDomainContent hook.
 */
export type UseDomainContentResult = {
  /**
   * the tagged content items found across the ecosystem for the domain.
   */
  content: TaggedContent[];

  /**
   * whether the content is currently being fetched.
   */
  loading: boolean;

  /**
   * an error message, if the query failed.
   */
  error?: string;

  /**
   * whether the query completed and returned no content.
   */
  isEmpty: boolean;

  /**
   * re-run the query against the ecosystem.
   */
  refetch: () => void;
};

const GET_CONTENT_BY_DOMAIN = gql`
  query GetContentByDomain($options: GetContentByDomainOptions) {
    getContentByDomain(options: $options) {
      type
      id
      title
      excerpt
      url
      imageUrl
      domains
    }
  }
`;

function toTaggedContent(plain: PlainTaggedContent): TaggedContent {
  return {
    type: plain.type || '',
    id: plain.id || '',
    title: plain.title || '',
    excerpt: plain.excerpt || undefined,
    url: plain.url || '',
    imageUrl: plain.imageUrl || undefined,
    domains: plain.domains || [],
  };
}

/**
 * a cross-slice query hook that, given a knowledge domain id (and optionally
 * a list of content types), returns all the content tagged with that domain
 * across the entire Helam Club ecosystem — apps, posts, records, events and
 * gallery items alike — together with loading and empty states.
 */
export function useDomainContent(domainId: string, options?: UseDomainContentOptions): UseDomainContentResult {
  const { types, limit, offset, mockData } = options || {};

  const variables = useMemo(
    () => ({
      options: {
        domainId,
        types,
        limit,
        offset,
      },
    }),
    [domainId, types, limit, offset]
  );

  const results = useQuery<{ getContentByDomain: PlainTaggedContent[] }>(GET_CONTENT_BY_DOMAIN, {
    variables,
    skip: Boolean(mockData) || !domainId,
  });

  const content = useMemo(() => {
    if (mockData) return mockData;
    return (results.data?.getContentByDomain || []).map(toTaggedContent);
  }, [mockData, results.data]);

  const loading = mockData ? false : results.loading;

  return {
    content,
    loading,
    error: mockData ? undefined : results.error?.message,
    isEmpty: !loading && content.length === 0,
    refetch: () => {
      results.refetch();
    },
  };
}
