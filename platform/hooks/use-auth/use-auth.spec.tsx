import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { useAuth } from './use-auth.js';

it('should return null user when signed out', async () => {
  const { result } = renderHook(() => useAuth({ mockData: null }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.user).toBeNull();
  expect(result.current.isAdmin).toBe(false);
  expect(result.current.isModerator).toBe(false);
  expect(result.current.canWrite).toBe(false);
});

it('should return the authenticated user from mock data', async () => {
  const member = mockUser({ role: 'member', displayName: 'Sam Doe' });

  const { result } = renderHook(() => useAuth({ mockData: member.toObject() }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.user?.displayName).toBe('Sam Doe');
  expect(result.current.canWrite).toBe(false);
});

it('should expose role helpers for an admin user', async () => {
  const admin = mockUser({ role: 'admin', displayName: 'Helem Admin' });

  const { result } = renderHook(() => useAuth({ mockData: admin.toObject() }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.isAdmin).toBe(true);
  expect(result.current.isModerator).toBe(true);
  expect(result.current.canWrite).toBe(true);
});

it('should expose role helpers for a writer user', async () => {
  const writer = mockUser({ role: 'writer', displayName: 'Noa Writer' });

  const { result } = renderHook(() => useAuth({ mockData: writer.toObject() }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.isAdmin).toBe(false);
  expect(result.current.isModerator).toBe(false);
  expect(result.current.canWrite).toBe(true);
});
