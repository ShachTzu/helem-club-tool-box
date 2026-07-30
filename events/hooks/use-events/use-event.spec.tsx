import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvent } from '@helemclub/events.entities.event';
import { useEvent } from './use-event.js';

it('should return the event provided via mock data', () => {
  const event = mockEvent({ slug: 'round-table-shame', title: 'שולחן עגול: בושה ואשמה' });

  const { result } = renderHook(() => useEvent('round-table-shame', { mockData: event.toObject() }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.event?.slug).toBe('round-table-shame');
  expect(result.current.event?.title).toBe('שולחן עגול: בושה ואשמה');
  expect(result.current.loading).toBe(false);
});

it('should return null when mock data is explicitly null', () => {
  const { result } = renderHook(() => useEvent('missing-event', { mockData: null }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.event).toBeNull();
  expect(result.current.error).toBeUndefined();
});
