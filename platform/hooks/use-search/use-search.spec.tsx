import { renderHook, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockSearchResults } from '@helemclub/platform.entities.search-result';
import { useSearch } from './use-search.js';

it('returns no results and is not loading when the query is empty', () => {
  const { result } = renderHook(() => useSearch(''), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.results).toEqual([]);
  expect(result.current.loading).toBe(false);
  expect(result.current.isEmpty).toBe(false);
});

it('returns mock results immediately when mockData is provided', async () => {
  const mockResults = mockSearchResults();

  const { result } = renderHook(() => useSearch('נשימה', { mockData: mockResults }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.results.length).toBe(mockResults.length);
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.isEmpty).toBe(false);
});

it('groups mock results by their content type', async () => {
  const mockResults = mockSearchResults();

  const { result } = renderHook(() => useSearch('חרדה', { mockData: mockResults }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(Object.keys(result.current.groupedResults).length).toBeGreaterThan(0);
  });

  expect(result.current.groupedResults.app?.length).toBe(1);
  expect(result.current.groupedResults.blog?.length).toBe(1);
  expect(result.current.groupedResults.event?.length).toBe(1);
});

it('reports isEmpty as false while mock data is provided but empty', () => {
  const { result } = renderHook(() => useSearch('חרדה', { mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.results).toEqual([]);
  expect(result.current.isEmpty).toBe(true);
});
