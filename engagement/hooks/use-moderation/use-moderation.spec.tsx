import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { mockComments } from '@helemclub/engagement.entities.comment';
import { useModeration } from './use-moderation.js';

describe('useModeration', () => {
  it('should return the moderation queue from mock data', () => {
    const mocked = mockComments().map((comment) => comment.toObject());

    const { result } = renderHook(() => useModeration({ mockData: mocked }), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      ),
    });

    expect(result.current.comments.length).toBe(mocked.length);
    expect(result.current.loading).toBe(false);
  });

  it('should expose only hidden/reported comments provided via mock data', () => {
    const mocked = mockComments()
      .filter((comment) => comment.hidden)
      .map((comment) => comment.toObject());

    const { result } = renderHook(() => useModeration({ mockData: mocked }), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      ),
    });

    expect(result.current.comments.every((comment) => comment.hidden)).toBe(true);
  });

  it('should not be resolving by default', () => {
    const { result } = renderHook(() => useModeration({ mockData: [] }), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      ),
    });

    expect(result.current.resolving).toBe(false);
    expect(result.current.resolveError).toBeUndefined();
  });

  it('should return an empty queue when mock data is empty', async () => {
    const { result } = renderHook(() => useModeration({ mockData: [] }), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.comments.length).toBe(0);
    });
  });
});
