import React from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { useDomains, useGetContentDomains } from './use-domains.js';
import { domainsMock } from './use-domains.mock.js';

it('should return domains from provided mock data', () => {
  const { result } = renderHook(() => useDomains({ mockData: domainsMock }), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <MockedProvider>{children}</MockedProvider>
      </MemoryRouter>
    ),
  });

  expect(result.current.domains.length).toBe(3);
  expect(result.current.domains[0].name).toBe('חרדה');
});

it('should not be loading when mock data is provided', () => {
  const { result } = renderHook(() => useDomains({ mockData: domainsMock }), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <MockedProvider>{children}</MockedProvider>
      </MemoryRouter>
    ),
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return an empty domains list when no data is available yet', () => {
  const { result } = renderHook(() => useDomains(), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <MockedProvider>{children}</MockedProvider>
      </MemoryRouter>
    ),
  });

  expect(result.current.domains).toEqual([]);
});

it('should return content domains from provided mock data', () => {
  const { result } = renderHook(
    () => useGetContentDomains({ targetType: 'app', targetId: 'app-1', mockData: domainsMock }),
    {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      ),
    }
  );

  expect(result.current.domains.length).toBe(3);
  expect(result.current.domains[1].slug).toBe('sleep');
});
