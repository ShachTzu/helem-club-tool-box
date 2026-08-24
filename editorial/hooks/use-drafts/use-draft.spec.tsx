import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { useDraft } from './use-draft.js';

it('should return the mocked draft without querying the server', () => {
  const [draft] = mockDrafts();

  const { result } = renderHook(() => useDraft(draft.id, { mockData: draft }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.draft?.id).toBe(draft.id);
});

it('should return undefined when mock data is explicitly null', () => {
  const { result } = renderHook(() => useDraft('missing-id', { mockData: null }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.draft).toBeUndefined();
  expect(result.current.loading).toBe(false);
});

it('should query the server for a draft when no mock data is provided', async () => {
  const [draft] = mockDrafts();

  const { result } = renderHook(() => useDraft(draft.id), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});
