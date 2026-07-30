import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvents } from '@helemclub/events.entities.event';
import { useListEvents } from './use-list-events.js';

it('should return all mocked events when no filter is applied', () => {
  const plainEvents = mockEvents().map((event) => event.toObject());

  const { result } = renderHook(() => useListEvents({ mockData: plainEvents }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.events).toHaveLength(plainEvents.length);
});

it('should map plain events into Event entities', () => {
  const plainEvents = mockEvents().map((event) => event.toObject());

  const { result } = renderHook(() => useListEvents({ mockData: plainEvents }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.events[0].slug).toBe(plainEvents[0].slug);
  expect(result.current.events[0].isPast).toBeDefined();
});
