import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvents } from '@helemclub/events.entities.event';
import { EventsPreview } from './events-preview.js';

const events = mockEvents().map((event) => event.toObject());

/**
 * the events preview populated with the default mock events.
 */
export const BasicEventsPreview = () => (
  <MockProvider>
    <EventsPreview mockEvents={events} />
  </MockProvider>
);

/**
 * the events preview limited to two upcoming events.
 */
export const TwoUpcoming = () => (
  <MockProvider>
    <EventsPreview mockEvents={events} limit={2} />
  </MockProvider>
);
