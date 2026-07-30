import type { PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { useGalleryItems, type GalleryItemsFilters } from './use-gallery-items.js';
import { useGalleryItem } from './use-gallery-item.js';
import { useCreateGalleryItem, type CreateGalleryItemInput } from './use-create-gallery-item.js';
import { useUpdateGalleryItem, type UpdateGalleryItemInput } from './use-update-gallery-item.js';
import { useDeleteGalleryItem } from './use-delete-gallery-item.js';

export type UseGalleryOptions = {
  /**
   * provide mock items to bypass the network request, useful for tests and previews.
   */
  mockData?: PlainGalleryItem[];
};

/**
 * a composed hook for working with the PTSDART gallery: lists and filters
 * items by media type, coping-domain and free-text query, fetches a single
 * item on demand, and exposes create/update/delete operations.
 */
export function useGallery(filters?: GalleryItemsFilters, options?: UseGalleryOptions) {
  const { items, loading, error, refetch } = useGalleryItems(filters, { mockData: options?.mockData });
  const { item, getItem, loading: itemLoading, error: itemError } = useGalleryItem();
  const { createItem, loading: creating, error: createError } = useCreateGalleryItem();
  const { updateItem, loading: updating, error: updateError } = useUpdateGalleryItem();
  const { deleteItem, loading: deleting, error: deleteError } = useDeleteGalleryItem();

  return {
    items,
    loading,
    error,
    refetch,
    item,
    getItem,
    itemLoading,
    itemError,
    createItem,
    creating,
    createError,
    updateItem,
    updating,
    updateError,
    deleteItem,
    deleting,
    deleteError,
  };
}

export type { GalleryItemsFilters, CreateGalleryItemInput, UpdateGalleryItemInput };
