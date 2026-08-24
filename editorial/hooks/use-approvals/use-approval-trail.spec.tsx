import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockApprovalEntries } from '@helemclub/editorial.entities.approval-entry';
import { useApprovalTrail } from './use-approval-trail.js';

it('returns the provided mock entries immediately without loading', () => {
  const entries = mockApprovalEntries();

  const { result } = renderHook(() => useApprovalTrail('draft-1', { mockData: entries }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.entries.length).toBe(entries.length);
  expect(result.current.loading).toBe(false);
});

it('returns an empty trail and no error when no mock data is provided and the query is skipped', () => {
  const { result } = renderHook(() => useApprovalTrail(''), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.entries).toEqual([]);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('preserves the order of the mock approval trail entries', () => {
  const entries = mockApprovalEntries();

  const { result } = renderHook(() => useApprovalTrail('draft-1', { mockData: entries }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.entries[0].action).toBe('created');
  expect(result.current.entries[result.current.entries.length - 1].action).toBe('published');
});
