import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { GalleryItem, type PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';

/**
 * input required to create a new gallery item.
 */
export type CreateGalleryItemInput = {
  title: string;
  description?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  artistName?: string;
  domains?: string[];
};

const CREATE_ITEM_MUTATION = gql`
  mutation CreateGalleryItem($options: CreateGalleryItemOptions) {
    createItem(options: $options) {
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
 * creates a new gallery item and returns the created entity.
 */
export function useCreateGalleryItem() {
  const [mutate, results] = useMutation<{ createItem: PlainGalleryItem }>(CREATE_ITEM_MUTATION);

  const createItem = async (input: CreateGalleryItemInput) => {
    const response = await mutate({ variables: { options: input } });
    const rawItem = response.data?.createItem;
    return rawItem ? GalleryItem.from(rawItem) : undefined;
  };

  const rawItem = results.data?.createItem;

  const item = useMemo(() => {
    return rawItem ? GalleryItem.from(rawItem) : undefined;
  }, [rawItem]);

  return {
    createItem,
    item,
    loading: results.loading,
    error: results.error,
  };
}
