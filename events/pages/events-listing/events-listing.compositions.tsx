import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvents } from '@helemclub/events.entities.event';
import { EventsListing } from './events-listing.js';

/** Events listing with upcoming and past events. */
export const BasicEventsListing = () => (
  <MockProvider>
    <EventsListing mockEvents={mockEvents().map((event) => event.toObject())} />
  </MockProvider>
);

/** Empty state when there are no events. */
export const EmptyEventsListing = () => (
  <MockProvider>
    <EventsListing mockEvents={[]} />
  </MockProvider>
);
