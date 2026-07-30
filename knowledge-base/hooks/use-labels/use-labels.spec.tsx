import { renderHook } from '@testing-library/react';
import { mockLabels } from '@helemclub/knowledge-base.entities.label';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useLabels } from './use-labels.js';

it('should return labels from provided mock data', () => {
  const labels = mockLabels();
  const { result } = renderHook(() => useLabels({ mockData: labels.map((label) => label.toObject()) }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.labels).toHaveLength(labels.length);
  expect(result.current.labels[0].name).toBe(labels[0].name);
});

it('should not be loading when mock data is provided', () => {
  const labels = mockLabels();
  const { result } = renderHook(() => useLabels({ mockData: labels.map((label) => label.toObject()) }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
});

it('should return an empty list when no data is available and query is skipped', () => {
  const { result } = renderHook(() => useLabels({ mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.labels).toHaveLength(0);
});
