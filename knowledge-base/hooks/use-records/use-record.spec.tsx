import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockMediaRecord } from '@helemclub/knowledge-base.entities.media-record';
import { useRecord } from './use-record.js';

it('should return the mock record without loading', () => {
  const record = mockMediaRecord();

  const { result } = renderHook(() => useRecord(record.slug, { mockData: record }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.record?.id).toBe(record.id);
});

it('should return undefined record when no mock data is provided and no slug is given', () => {
  const { result } = renderHook(() => useRecord(undefined), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.record).toBeUndefined();
});
