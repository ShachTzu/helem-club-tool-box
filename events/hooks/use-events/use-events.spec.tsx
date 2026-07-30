import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvents } from '@helemclub/events.entities.event';
import { useEvents } from './use-events.js';

it('should return the list of events provided via mock data', () => {
  const events = mockEvents();
  const plainEvents = events.map((event) => event.toObject());

  const { result } = renderHook(() => useEvents({ mockData: plainEvents }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.list.events).toHaveLength(plainEvents.length);
  expect(result.current.list.loading).toBe(false);
});

it('should expose create, update, delete and publish-recording actions', () => {
  const { result } = renderHook(() => useEvents({ mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(typeof result.current.createEvent).toBe('function');
  expect(typeof result.current.updateEvent).toBe('function');
  expect(typeof result.current.deleteEvent).toBe('function');
  expect(typeof result.current.publishRecording).toBe('function');
  expect(result.current.creating).toBe(false);
  expect(result.current.updating).toBe(false);
  expect(result.current.deleting).toBe(false);
  expect(result.current.publishingRecording).toBe(false);
});

it('should return an empty list when no events are provided', () => {
  const { result } = renderHook(() => useEvents({ mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.list.events).toEqual([]);
});
