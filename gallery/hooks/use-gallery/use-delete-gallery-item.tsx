import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteGalleryItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

/**
 * deletes a gallery item by id and returns whether the deletion succeeded.
 */
export function useDeleteGalleryItem() {
  const [mutate, results] = useMutation<{ deleteItem: boolean }>(DELETE_ITEM_MUTATION);

  const deleteItem = async (id: string) => {
    const response = await mutate({ variables: { id } });
    return Boolean(response.data?.deleteItem);
  };

  return {
    deleteItem,
    deleted: results.data?.deleteItem,
    loading: results.loading,
    error: results.error,
  };
}
