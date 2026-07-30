import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { GalleryItem, type PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';

/**
 * partial fields used to update an existing gallery item.
 */
export type UpdateGalleryItemInput = {
  title?: string;
  description?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  artistName?: string;
  domains?: string[];
};

const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateGalleryItem($id: ID!, $options: UpdateGalleryItemOptions) {
    updateItem(id: $id, options: $options) {
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
 * updates an existing gallery item and returns the updated entity.
 */
export function useUpdateGalleryItem() {
  const [mutate, results] = useMutation<{ updateItem: PlainGalleryItem }>(UPDATE_ITEM_MUTATION);

  const updateItem = async (id: string, input: UpdateGalleryItemInput) => {
    const response = await mutate({ variables: { id, options: input } });
    const rawItem = response.data?.updateItem;
    return rawItem ? GalleryItem.from(rawItem) : undefined;
  };

  const rawItem = results.data?.updateItem;

  const item = useMemo(() => {
    return rawItem ? GalleryItem.from(rawItem) : undefined;
  }, [rawItem]);

  return {
    updateItem,
    item,
    loading: results.loading,
    error: results.error,
  };
}
