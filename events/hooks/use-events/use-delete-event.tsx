import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation deleting an event by id.
 */
export const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id)
  }
`;

type DeleteEventData = {
  deleteEvent: boolean | null;
};

export type UseDeleteEventValue = {
  /**
   * deletes an event by id. resolves with whether the deletion succeeded.
   */
  deleteEvent: (id: string) => Promise<boolean>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised by the mutation, if any.
   */
  error?: Error;
};

/**
 * deletes a community event by id.
 */
export function useDeleteEvent(): UseDeleteEventValue {
  const [mutate, { loading, error }] = useMutation<DeleteEventData>(DELETE_EVENT_MUTATION);

  const deleteEvent = async (id: string) => {
    const result = await mutate({ variables: { id } });
    return Boolean(result.data?.deleteEvent);
  };

  return { deleteEvent, loading, error };
}
