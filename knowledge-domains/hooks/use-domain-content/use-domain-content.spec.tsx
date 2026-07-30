import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useDomainContent } from './use-domain-content.js';
import { mockTaggedContentList } from './use-domain-content.mock.js';

it('should return the provided mock content', () => {
  const mockData = mockTaggedContentList();

  const { result } = renderHook(() => useDomainContent('triggers', { mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.content).toHaveLength(mockData.length);
  expect(result.current.content[0].id).toBe('triggers-toolkit');
});

it('should not be loading when mock data is provided', () => {
  const mockData = mockTaggedContentList();

  const { result } = renderHook(() => useDomainContent('triggers', { mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should report isEmpty when there is no content', () => {
  const { result } = renderHook(() => useDomainContent('triggers', { mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.isEmpty).toBe(true);
  expect(result.current.content).toHaveLength(0);
});

it('should be loading while the query is pending without mock data', () => {
  const { result } = renderHook(() => useDomainContent('triggers'), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.content).toHaveLength(0);
});
