import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation publishing a recorded media record for a past event.
 */
export const PUBLISH_RECORDING_MUTATION = gql`
  mutation PublishRecording($eventId: String!, $options: PublishRecordingOptions) {
    publishRecording(eventId: $eventId, options: $options)
  }
`;

type PublishRecordingData = {
  publishRecording: boolean | null;
};

/**
 * input needed to publish a recording for an event.
 */
export type PublishRecordingInput = {
  labelId: string;
  title: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  domains?: string[];
};

export type UsePublishRecordingValue = {
  /**
   * publishes a recording for the given event. resolves with whether the
   * publish succeeded.
   */
  publishRecording: (eventId: string, input: PublishRecordingInput) => Promise<boolean>;

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
 * publishes a recorded media record (e.g. video or audio) for a past event,
 * making it available in the knowledge base.
 */
export function usePublishRecording(): UsePublishRecordingValue {
  const [mutate, { loading, error }] = useMutation<PublishRecordingData>(PUBLISH_RECORDING_MUTATION);

  const publishRecording = async (eventId: string, input: PublishRecordingInput) => {
    const result = await mutate({ variables: { eventId, options: input } });
    return Boolean(result.data?.publishRecording);
  };

  return { publishRecording, loading, error };
}
