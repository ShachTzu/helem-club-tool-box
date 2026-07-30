import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { mockAppsData, mockPendingAppsData } from './use-apps.mock.js';
import { useApps } from './use-apps.js';

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <MemoryRouter>
      <MockedProvider>{children}</MockedProvider>
    </MemoryRouter>
  );
}

it('should return the provided mock apps without loading', () => {
  const mockData = mockAppsData();

  const { result } = renderHook(() => useApps({ mockData }), {
    wrapper: Wrapper,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.apps.length).toBe(mockData.length);
  expect(result.current.apps[0].name).toBe(mockData[0].name);
});

it('should return the provided mock pending apps without loading', () => {
  const mockPendingData = mockPendingAppsData();

  const { result } = renderHook(() => useApps({ mockPendingData }), {
    wrapper: Wrapper,
  });

  expect(result.current.pendingLoading).toBe(false);
  expect(result.current.pendingApps.length).toBe(mockPendingData.length);
  expect(result.current.pendingApps[0].status).toBe('pending');
});

it('should expose submitApp, reviewApp, getApp and incrementClick functions', () => {
  const { result } = renderHook(() => useApps({ mockData: mockAppsData() }), {
    wrapper: Wrapper,
  });

  expect(typeof result.current.submitApp).toBe('function');
  expect(typeof result.current.reviewApp).toBe('function');
  expect(typeof result.current.getApp).toBe('function');
  expect(typeof result.current.incrementClick).toBe('function');
});

it('should be in a loading state when no mock data is provided', async () => {
  const { result } = renderHook(() => useApps(), {
    wrapper: Wrapper,
  });

  expect(result.current.apps).toEqual([]);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});
