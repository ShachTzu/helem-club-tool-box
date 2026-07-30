import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { mockAppReviewsData } from './use-app-reviews.mock.js';
import { useAppReviews } from './use-app-reviews.js';

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <MemoryRouter>
      <MockedProvider>{children}</MockedProvider>
    </MemoryRouter>
  );
}

it('should return the provided mock reviews without loading', () => {
  const mockData = mockAppReviewsData();

  const { result } = renderHook(() => useAppReviews('ground-me', { mockData }), {
    wrapper: Wrapper,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.reviews.length).toBe(mockData.length);
  expect(result.current.reviews[0].appId).toBe('ground-me');
});

it('should expose a rateApp function', () => {
  const mockData = mockAppReviewsData();

  const { result } = renderHook(() => useAppReviews('ground-me', { mockData }), {
    wrapper: Wrapper,
  });

  expect(typeof result.current.rateApp).toBe('function');
});

it('should be in a loading state when no mock data is provided', async () => {
  const { result } = renderHook(() => useAppReviews('ground-me'), {
    wrapper: Wrapper,
  });

  expect(result.current.reviews).toEqual([]);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});
