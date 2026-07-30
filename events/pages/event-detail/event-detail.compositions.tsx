import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvent } from '@helemclub/events.entities.event';
import { EventDetail } from './event-detail.js';

/** A single event rendered in full. */
export const BasicEventDetail = () => (
  <MockProvider>
    <EventDetail mockEvent={mockEvent().toObject()} />
  </MockProvider>
);

/** Not-found state for a missing event. */
export const EventNotFound = () => (
  <MockProvider>
    <EventDetail mockEvent={null} />
  </MockProvider>
);
