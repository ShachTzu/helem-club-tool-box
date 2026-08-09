import React, { type ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useOnboarding, type MembershipStatus } from './use-onboarding.js';

// the hook reads the membership state over GraphQL, so it needs an Apollo
// client in context even when `mockStatus` short-circuits the query itself.
const wrapper = ({ children }: { children: ReactNode }) => <MockProvider>{children}</MockProvider>;

function renderWithStatus(mockStatus: MembershipStatus) {
  return renderHook(() => useOnboarding({ mockStatus }), { wrapper });
}

it('reports a fresh account as not onboarded and not a member', () => {
  const { result } = renderWithStatus('none');
  expect(result.current.completed).toBe(false);
  expect(result.current.isMember).toBe(false);
});

it('treats a pending member as onboarded but not yet a member', () => {
  const { result } = renderWithStatus('pending');
  expect(result.current.completed).toBe(true);
  expect(result.current.isMember).toBe(false);
});

it('treats an approved member as a community member', () => {
  const { result } = renderWithStatus('approved');
  expect(result.current.completed).toBe(true);
  expect(result.current.isMember).toBe(true);
});

it('does not send a rejected member back through onboarding', () => {
  const { result } = renderWithStatus('rejected');
  expect(result.current.completed).toBe(true);
  expect(result.current.isMember).toBe(false);
});
