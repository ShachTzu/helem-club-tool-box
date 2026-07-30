import {
  useListEvents,
  type UseListEventsOptions,
  type UseListEventsValue,
  type EventsWhen,
} from './use-list-events.js';
import { useCreateEvent, type CreateEventInput, type UseCreateEventValue } from './use-create-event.js';
import { useUpdateEvent, type UpdateEventInput, type UseUpdateEventValue } from './use-update-event.js';
import { useDeleteEvent, type UseDeleteEventValue } from './use-delete-event.js';
import {
  usePublishRecording,
  type PublishRecordingInput,
  type UsePublishRecordingValue,
} from './use-publish-recording.js';

export type {
  EventsWhen,
  UseListEventsOptions,
  CreateEventInput,
  UpdateEventInput,
  PublishRecordingInput,
};

export type UseEventsValue = {
  /**
   * lists events, optionally filtered by type, domain ids, and whether
   * they are upcoming or past.
   */
  list: UseListEventsValue;

  /**
   * creates a new event.
   */
  createEvent: UseCreateEventValue['createEvent'];

  /**
   * whether an event creation is in flight.
   */
  creating: boolean;

  /**
   * error raised while creating an event, if any.
   */
  createError?: Error;

  /**
   * updates an existing event by id.
   */
  updateEvent: UseUpdateEventValue['updateEvent'];

  /**
   * whether an event update is in flight.
   */
  updating: boolean;

  /**
   * error raised while updating an event, if any.
   */
  updateError?: Error;

  /**
   * deletes an event by id.
   */
  deleteEvent: UseDeleteEventValue['deleteEvent'];

  /**
   * whether an event deletion is in flight.
   */
  deleting: boolean;

  /**
   * error raised while deleting an event, if any.
   */
  deleteError?: Error;

  /**
   * publishes a recording for a past event.
   */
  publishRecording: UsePublishRecordingValue['publishRecording'];

  /**
   * whether publishing a recording is in flight.
   */
  publishingRecording: boolean;

  /**
   * error raised while publishing a recording, if any.
   */
  publishRecordingError?: Error;
};

/**
 * manages community events: lists events with optional type, domain and
 * upcoming/past filters, resolves a single event by id or slug, and
 * exposes create, update, delete and publish-recording actions.
 */
export function useEvents(options?: UseListEventsOptions): UseEventsValue {
  const list = useListEvents(options);
  const { createEvent, loading: creating, error: createError } = useCreateEvent();
  const { updateEvent, loading: updating, error: updateError } = useUpdateEvent();
  const { deleteEvent, loading: deleting, error: deleteError } = useDeleteEvent();
  const {
    publishRecording,
    loading: publishingRecording,
    error: publishRecordingError,
  } = usePublishRecording();

  return {
    list,
    createEvent,
    creating,
    createError,
    updateEvent,
    updating,
    updateError,
    deleteEvent,
    deleting,
    deleteError,
    publishRecording,
    publishingRecording,
    publishRecordingError,
  };
}
