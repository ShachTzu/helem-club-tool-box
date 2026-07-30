import { renderHook } from '@testing-library/react';
import { mockLabel } from '@helemclub/knowledge-base.entities.label';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useLabel } from './use-label.js';

it('should return a label from provided mock data', () => {
  const label = mockLabel();
  const { result } = renderHook(() => useLabel(label.slug, { mockData: label.toObject() }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.label?.slug).toBe(label.slug);
  expect(result.current.label?.name).toBe(label.name);
});

it('should not be loading when mock data is provided', () => {
  const label = mockLabel();
  const { result } = renderHook(() => useLabel(label.slug, { mockData: label.toObject() }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
});
