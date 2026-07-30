import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockRsvp } from '@helemclub/events.entities.rsvp';
import { useRsvp } from './use-rsvp.js';

const member = {
  id: 'user-1',
  email: 'sam@helemclub.org',
  displayName: 'Sam Doe',
  role: 'member' as const,
  provider: 'email' as const,
  createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
};

const admin = {
  id: 'user-2',
  email: 'admin@helemclub.org',
  displayName: 'Helem Admin',
  role: 'admin' as const,
  provider: 'email' as const,
  createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
};

it('reports attending as false when the current user has no RSVP', async () => {
  const { result } = renderHook(() => useRsvp('event-1', { mockData: { user: member, rsvps: [] } }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.attending).toBe(false);
  expect(result.current.rsvp).toBeUndefined();
  expect(result.current.rsvpCount).toBe(0);
});

it('reports attending as true when the current user has an attending RSVP', async () => {
  const myRsvp = mockRsvp({ eventId: 'event-1', userId: member.id, attending: true }).toObject();

  const { result } = renderHook(() => useRsvp('event-1', { mockData: { user: member, rsvps: [myRsvp] } }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.attending).toBe(true);
  expect(result.current.rsvp?.id).toBe(myRsvp.id);
  expect(result.current.rsvpCount).toBe(1);
});

it('hides the RSVP list from non-admin users', async () => {
  const rsvps = [mockRsvp({ eventId: 'event-1', userId: member.id }).toObject()];

  const { result } = renderHook(() => useRsvp('event-1', { mockData: { user: member, rsvps } }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.isAdmin).toBe(false);
  expect(result.current.rsvps).toEqual([]);
  expect(result.current.rsvpCount).toBe(1);
});

it('exposes the full RSVP list to admin users', async () => {
  const rsvps = [
    mockRsvp({ eventId: 'event-1', userId: member.id, attending: true }).toObject(),
    mockRsvp({ eventId: 'event-1', userId: admin.id, attending: false }).toObject(),
  ];

  const { result } = renderHook(() => useRsvp('event-1', { mockData: { user: admin, rsvps } }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.isAdmin).toBe(true);
  expect(result.current.rsvps.length).toBe(2);
});

it('does nothing when toggling RSVP without a signed-in user', async () => {
  const { result } = renderHook(() => useRsvp('event-1', { mockData: { user: null, rsvps: [] } }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  await act(async () => {
    await result.current.toggleRsvp();
  });

  expect(result.current.attending).toBe(false);
});
