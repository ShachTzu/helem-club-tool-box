import { renderHook } from '@testing-library/react';
import { useDeviceId } from './use-device-id.js';

it('returns a non-empty device id string', () => {
  const { result } = renderHook(() => useDeviceId());

  expect(typeof result.current).toBe('string');
  expect(result.current.length).toBeGreaterThan(0);
});

it('returns the same device id across remounts', () => {
  const first = renderHook(() => useDeviceId());
  const firstId = first.result.current;
  first.unmount();

  const second = renderHook(() => useDeviceId());
  const secondId = second.result.current;

  expect(secondId).toBe(firstId);
});

it('returns the provided mockDeviceId when set', () => {
  const { result } = renderHook(() => useDeviceId({ mockDeviceId: 'test-device-123' }));

  expect(result.current).toBe('test-device-123');
});

it('returns a different mockDeviceId when the option changes', () => {
  const { result, rerender } = renderHook(
    ({ mockDeviceId }: { mockDeviceId: string }) => useDeviceId({ mockDeviceId }),
    { initialProps: { mockDeviceId: 'device-a' } }
  );

  expect(result.current).toBe('device-a');

  rerender({ mockDeviceId: 'device-b' });

  expect(result.current).toBe('device-b');
});
