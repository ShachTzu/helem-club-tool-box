import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { GalleryItem, type PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';

/**
 * filters supported when listing gallery items.
 */
export type GalleryItemsFilters = {
  /**
   * filter items by media type (e.g. 'image' or 'video').
   */
  mediaType?: string;

  /**
   * filter items by one or more coping-domain ids.
   */
  domainIds?: string[];

  /**
   * free-text search query matched against the item title/description.
   */
  query?: string;

  /**
   * maximum number of items to return.
   */
  limit?: number;
};

export type UseGalleryItemsOptions = {
  /**
   * provide mock data to bypass the network request, useful for tests and previews.
   */
  mockData?: PlainGalleryItem[];
};

const LIST_ITEMS_QUERY = gql`
  query ListGalleryItems($options: ListGalleryItemsOptions) {
    listItems(options: $options) {
      id
      slug
      title
      description
      mediaType
      mediaUrl
      thumbnailUrl
      artistName
      domains
      createdAt
    }
  }
`;

/**
 * lists and filters gallery items by media type, coping-domain and free-text query.
 */
export function useGalleryItems(filters?: GalleryItemsFilters, options?: UseGalleryItemsOptions) {
  const hasMockData = Boolean(options?.mockData);

  const results = useQuery<{ listItems: PlainGalleryItem[] }>(LIST_ITEMS_QUERY, {
    variables: {
      options: {
        mediaType: filters?.mediaType,
        domainIds: filters?.domainIds,
        query: filters?.query,
        limit: filters?.limit,
      },
    },
    skip: hasMockData,
  });

  const rawItems = hasMockData ? options?.mockData : results.data?.listItems;

  const items = useMemo(() => {
    return (rawItems ?? []).filter(Boolean).map((item) => GalleryItem.from(item));
  }, [rawItems]);

  return {
    items,
    loading: hasMockData ? false : results.loading,
    error: hasMockData ? undefined : results.error,
    refetch: results.refetch,
  };
}
