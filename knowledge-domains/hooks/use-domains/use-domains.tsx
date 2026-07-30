import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Domain, type PlainDomain } from '@helemclub/knowledge-domains.entities.domain';

const LIST_DOMAINS_QUERY = gql`
  query ListDomains {
    listDomains {
      id
      slug
      name
      description
      icon
      count
    }
  }
`;

const GET_CONTENT_DOMAINS_QUERY = gql`
  query GetContentDomains($options: GetContentDomainsOptions) {
    getContentDomains(options: $options) {
      id
      slug
      name
      description
      icon
      count
    }
  }
`;

const TAG_CONTENT_MUTATION = gql`
  mutation TagContent($options: TagContentOptions) {
    tagContent(options: $options) {
      id
      domainId
      targetType
      targetId
    }
  }
`;

export type UseDomainsOptions = {
  /**
   * provide mock data to skip the network request and return it directly.
   */
  mockData?: PlainDomain[];
};

export type UseDomainsResult = {
  /**
   * all knowledge domains, including their tagged content counts.
   */
  domains: Domain[];

  /**
   * whether the domains list is currently loading.
   */
  loading: boolean;

  /**
   * error message, if the domains query failed.
   */
  error?: string;

  /**
   * re-fetch the domains list from the server.
   */
  refetch: () => void;
};

/**
 * fetches all knowledge domains along with the number of content items
 * tagged with each of them.
 */
export function useDomains(options?: UseDomainsOptions): UseDomainsResult {
  const { data, loading, error, refetch } = useQuery<{ listDomains: PlainDomain[] }>(LIST_DOMAINS_QUERY, {
    skip: Boolean(options?.mockData),
  });

  const domains = useMemo(() => {
    if (options?.mockData) return options.mockData.map(Domain.from);
    return (data?.listDomains || []).map(Domain.from);
  }, [data, options?.mockData]);

  return {
    domains,
    loading: options?.mockData ? false : loading,
    error: options?.mockData ? undefined : error?.message,
    refetch: () => refetch(),
  };
}

export type GetContentDomainsOptions = {
  /**
   * the type of the content object (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  targetType: string;

  /**
   * the id of the content object.
   */
  targetId: string;

  /**
   * provide mock data to skip the network request and return it directly.
   */
  mockData?: PlainDomain[];
};

export type GetContentDomainsResult = {
  /**
   * the domains associated with the requested content object.
   */
  domains: Domain[];

  /**
   * whether the content domains are currently loading.
   */
  loading: boolean;

  /**
   * error message, if the content domains query failed.
   */
  error?: string;

  /**
   * re-fetch the content domains from the server.
   */
  refetch: () => void;
};

/**
 * fetches the knowledge domains associated with a specific content object,
 * identified by its target type and target id.
 */
export function useGetContentDomains(options: GetContentDomainsOptions): GetContentDomainsResult {
  const { targetType, targetId, mockData } = options;

  const { data, loading, error, refetch } = useQuery<{ getContentDomains: PlainDomain[] }>(
    GET_CONTENT_DOMAINS_QUERY,
    {
      variables: { options: { targetType, targetId } },
      skip: Boolean(mockData),
    }
  );

  const domains = useMemo(() => {
    if (mockData) return mockData.map(Domain.from);
    return (data?.getContentDomains || []).map(Domain.from);
  }, [data, mockData]);

  return {
    domains,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error?.message,
    refetch: () => refetch(),
  };
}

export type TagContentVariables = {
  /**
   * the type of the content object (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  targetType: string;

  /**
   * the id of the content object.
   */
  targetId: string;

  /**
   * ids of the domains to associate with the content object.
   */
  domainIds: string[];
};

export type PlainDomainTag = {
  id: string;
  domainId: string;
  targetType: string;
  targetId: string;
};

/**
 * associates a content object with a set of knowledge domains, replacing
 * any of its previous domain associations.
 */
export function useTagContent() {
  const [mutate, { data, loading, error }] = useMutation<{ tagContent: PlainDomainTag[] }>(TAG_CONTENT_MUTATION);

  const tagContent = (variables: TagContentVariables) => {
    return mutate({ variables: { options: variables } });
  };

  return {
    tagContent,
    tags: data?.tagContent,
    loading,
    error: error?.message,
  };
}
