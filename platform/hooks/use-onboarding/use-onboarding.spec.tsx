import { renderHook, act } from '@testing-library/react';
import { useOnboarding } from './use-onboarding.js';

it('starts incomplete and completes onboarding', () => {
  const { result } = renderHook(() => useOnboarding({ mockCompleted: false }));
  expect(result.current.completed).toBe(false);

  act(() => {
    result.current.completeOnboarding({ name: 'דנה', interests: ['שינה'] });
  });

  expect(result.current.completed).toBe(true);
});

it('resets the completion flag', () => {
  const { result } = renderHook(() => useOnboarding({ mockCompleted: true }));
  expect(result.current.completed).toBe(true);

  act(() => {
    result.current.resetOnboarding();
  });

  expect(result.current.completed).toBe(false);
});
