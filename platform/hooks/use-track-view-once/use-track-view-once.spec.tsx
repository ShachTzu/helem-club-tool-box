import { renderHook } from '@testing-library/react';
import { useTrackViewOnce } from './use-track-view-once.js';

it('fires onView once when the id first appears', () => {
  const seen: string[] = [];
  const { rerender } = renderHook(({ id }) => useTrackViewOnce(id, (v) => seen.push(v)), {
    initialProps: { id: undefined as string | undefined },
  });

  rerender({ id: 'a' });
  rerender({ id: 'a' });
  rerender({ id: 'a' });

  expect(seen).toEqual(['a']);
});

it('fires again when the id changes', () => {
  const seen: string[] = [];
  const { rerender } = renderHook(({ id }) => useTrackViewOnce(id, (v) => seen.push(v)), {
    initialProps: { id: 'a' },
  });

  rerender({ id: 'b' });

  expect(seen).toEqual(['a', 'b']);
});

it('never fires when skip is true', () => {
  const seen: string[] = [];
  renderHook(() => useTrackViewOnce('a', (v) => seen.push(v), { skip: true }));

  expect(seen).toEqual([]);
});
