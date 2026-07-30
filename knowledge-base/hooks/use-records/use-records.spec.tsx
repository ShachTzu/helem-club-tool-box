import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockMediaRecords } from '@helemclub/knowledge-base.entities.media-record';
import { useRecords } from './use-records.js';

it('should return mock records without loading', () => {
  const records = mockMediaRecords();

  const { result } = renderHook(() => useRecords({ mockData: records }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.records.length).toBe(records.length);
});

it('should return an empty list when no mock data and no query result', () => {
  const { result } = renderHook(() => useRecords({ mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.records).toEqual([]);
});

it('should expose the mocked record titles', () => {
  const records = mockMediaRecords();

  const { result } = renderHook(() => useRecords({ mockData: records }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  const titles = result.current.records.map((record) => record.title);
  expect(titles).toEqual(records.map((record) => record.title));
});
