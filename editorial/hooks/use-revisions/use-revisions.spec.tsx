import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { gql } from '@apollo/client';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockRevisions } from '@helemclub/editorial.entities.revision';
import { useRevisions } from './use-revisions.js';

const LIST_REVISIONS_QUERY = gql`
  query ListRevisions($draftId: ID) {
    listRevisions(draftId: $draftId) {
      id
      draftId
      versionNumber
      payload
      domains
      authorId
      authorName
      changeSummary
      createdAt
    }
  }
`;

it('should return mock revisions immediately when mockData is provided', () => {
  const revisions = mockRevisions();

  const { result } = renderHook(() => useRevisions('draft-42', { mockData: revisions }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.revisions).toHaveLength(4);
  expect(result.current.revisions[0].draftId).toBe('draft-42');
});

it('should fetch revisions from the server when no mockData is provided', async () => {
  const mocks = [
    {
      request: {
        query: LIST_REVISIONS_QUERY,
        variables: { draftId: 'draft-42' },
      },
      result: {
        data: {
          listRevisions: [
            {
              id: 'revision-1',
              draftId: 'draft-42',
              versionNumber: 1,
              payload: JSON.stringify({ title: 'כותרת' }),
              domains: ['onboarding'],
              authorId: 'user-1',
              authorName: 'דנה כהן',
              changeSummary: 'יצירת הטיוטה הראשונית',
              createdAt: '2024-01-01T09:00:00.000Z',
            },
          ],
        },
      },
    },
  ];

  const { result } = renderHook(() => useRevisions('draft-42'), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.revisions).toHaveLength(1);
  expect(result.current.revisions[0].payload).toEqual({ title: 'כותרת' });
});
