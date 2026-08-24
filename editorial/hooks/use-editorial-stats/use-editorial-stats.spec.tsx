import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useEditorialStats } from './use-editorial-stats.js';
import { mockEditorialStats, emptyEditorialStats } from './use-editorial-stats.mock.js';

it('returns mock stats immediately when mockData is provided', () => {
  const { result } = renderHook(() => useEditorialStats(30, { mockData: mockEditorialStats }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.stats?.totalDrafts).toBe(42);
  expect(result.current.stats?.byContentType.length).toBe(3);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('returns empty breakdowns when the mocked stats are empty', () => {
  const { result } = renderHook(() => useEditorialStats(30, { mockData: emptyEditorialStats }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.stats?.totalDrafts).toBe(0);
  expect(result.current.stats?.byContentType).toEqual([]);
  expect(result.current.stats?.byReviewer).toEqual([]);
});

it('updates the measured period without throwing when setDays is called', () => {
  const { result } = renderHook(() => useEditorialStats(30, { mockData: mockEditorialStats }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  act(() => {
    result.current.setDays(7);
  });

  expect(result.current.stats?.totalDrafts).toBe(42);
});
