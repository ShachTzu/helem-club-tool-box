import { useCallback, useMemo } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import { GalleryItem, type PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';

export type UseGalleryItemOptions = {
  /**
   * provide mock data to bypass the network request, useful for tests and previews.
   */
  mockData?: PlainGalleryItem;
};

const GET_ITEM_QUERY = gql`
  query GetGalleryItem($idOrSlug: String!) {
    getItem(idOrSlug: $idOrSlug) {
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
 * fetches a single gallery item by its id or slug, on demand via the returned getItem function.
 */
export function useGalleryItem(options?: UseGalleryItemOptions) {
  const hasMockData = Boolean(options?.mockData);
  const [fetchItem, results] = useLazyQuery<{ getItem: PlainGalleryItem }>(GET_ITEM_QUERY);

  const getItem = useCallback(
    async (idOrSlug: string) => {
      if (options?.mockData) {
        return GalleryItem.from(options.mockData);
      }

      const response = await fetchItem({ variables: { idOrSlug } });
      const rawItem = response.data?.getItem;
      return rawItem ? GalleryItem.from(rawItem) : undefined;
    },
    [fetchItem, options?.mockData]
  );

  const rawItem = hasMockData ? options?.mockData : results.data?.getItem;

  const item = useMemo(() => {
    return rawItem ? GalleryItem.from(rawItem) : undefined;
  }, [rawItem]);

  return {
    item,
    getItem,
    loading: hasMockData ? false : results.loading,
    error: hasMockData ? undefined : results.error,
  };
}
