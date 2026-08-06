import { renderHook } from '@testing-library/react';
import { useOnboarding } from './use-onboarding.js';

it('reports a fresh account as not onboarded and not a member', () => {
  const { result } = renderHook(() => useOnboarding({ mockStatus: 'none' }));
  expect(result.current.completed).toBe(false);
  expect(result.current.isMember).toBe(false);
});

it('treats a pending member as onboarded but not yet a member', () => {
  const { result } = renderHook(() => useOnboarding({ mockStatus: 'pending' }));
  expect(result.current.completed).toBe(true);
  expect(result.current.isMember).toBe(false);
});

it('treats an approved member as a community member', () => {
  const { result } = renderHook(() => useOnboarding({ mockStatus: 'approved' }));
  expect(result.current.completed).toBe(true);
  expect(result.current.isMember).toBe(true);
});

it('does not send a rejected member back through onboarding', () => {
  const { result } = renderHook(() => useOnboarding({ mockStatus: 'rejected' }));
  expect(result.current.completed).toBe(true);
  expect(result.current.isMember).toBe(false);
});
