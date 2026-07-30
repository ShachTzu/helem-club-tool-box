import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { useReactions } from './use-reactions.js';
import { likedReactionSummaryMock, unreactedReactionSummaryMock } from './use-reactions.mock.js';

it('should return mock reaction counts and current device reaction when mockData is provided', () => {
  const { result } = renderHook(
    () => useReactions('post', 'post-1', { mockData: likedReactionSummaryMock, mockDeviceId: 'device-1' }),
    { wrapper: ({ children }) => <MockedProvider mocks={[]}>{children}</MockedProvider> }
  );

  expect(result.current.counts).toEqual(likedReactionSummaryMock.counts);
  expect(result.current.myReaction).toBe('like');
  expect(result.current.loading).toBe(false);
});

it('should compute the total reaction count from all reaction types', () => {
  const { result } = renderHook(
    () => useReactions('event', 'event-1', { mockData: unreactedReactionSummaryMock, mockDeviceId: 'device-2' }),
    { wrapper: ({ children }) => <MockedProvider mocks={[]}>{children}</MockedProvider> }
  );

  expect(result.current.totalCount).toBe(13);
});

it('should return zero total count when there are no reactions', () => {
  const { result } = renderHook(
    () =>
      useReactions('gallery', 'gallery-1', {
        mockData: { counts: [], myReaction: undefined },
        mockDeviceId: 'device-3',
      }),
    { wrapper: ({ children }) => <MockedProvider mocks={[]}>{children}</MockedProvider> }
  );

  expect(result.current.totalCount).toBe(0);
  expect(result.current.myReaction).toBeUndefined();
});

it('should update counts and myReaction after toggling a reaction', async () => {
  const { gql } = await import('@apollo/client');

  const TOGGLE_REACTION = gql`
    mutation ToggleReaction($targetType: String!, $targetId: String!, $type: String!, $deviceId: String!) {
      toggleReaction(options: { targetType: $targetType, targetId: $targetId, type: $type, deviceId: $deviceId }) {
        counts {
          type
          count
        }
        myReaction
      }
    }
  `;

  const mocks = [
    {
      request: {
        query: TOGGLE_REACTION,
        variables: { targetType: 'record', targetId: 'record-1', type: 'like', deviceId: 'device-4' },
      },
      result: {
        data: {
          toggleReaction: {
            counts: [{ type: 'like', count: 5 }],
            myReaction: 'like',
          },
        },
      },
    },
  ];

  const { result } = renderHook(
    () => useReactions('record', 'record-1', { mockData: { counts: [], myReaction: undefined }, mockDeviceId: 'device-4' }),
    {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
    }
  );

  await act(async () => {
    await result.current.toggleReaction('like');
  });

  await waitFor(() => {
    expect(result.current.myReaction).toBe('like');
  });

  expect(result.current.counts).toEqual([{ type: 'like', count: 5 }]);
});
