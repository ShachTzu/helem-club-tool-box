import { renderHook } from '@testing-library/react';
import { useWisdomFeed } from './use-wisdom-feed.js';

it('aggregates content from all channels', () => {
  const { result } = renderHook(() => useWisdomFeed());
  expect(result.current.items.length).toBeGreaterThan(0);
  expect(result.current.total).toBe(result.current.items.length);
});

it('filters the feed by channel', () => {
  const { result } = renderHook(() => useWisdomFeed({ channels: ['post'] }));
  expect(result.current.items.every((item) => item.channel === 'post')).toBe(true);
});

it('limits the number of returned items', () => {
  const { result } = renderHook(() => useWisdomFeed({ limit: 3 }));
  expect(result.current.items.length).toBeLessThanOrEqual(3);
});
