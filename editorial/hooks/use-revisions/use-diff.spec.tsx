import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { gql } from '@apollo/client';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockFieldDiffs } from '@helemclub/editorial.entities.field-diff';
import { useDiff } from './use-diff.js';

const DIFF_REVISIONS_QUERY = gql`
  query DiffRevisions($options: DiffRevisionsOptions) {
    diffRevisions(options: $options) {
      field
      label
      before
      after
      changeKind
    }
  }
`;

it('should return mock diffs immediately when mockData is provided', () => {
  const diffs = mockFieldDiffs();

  const { result } = renderHook(() => useDiff('draft-42', 1, 2, { mockData: diffs }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.diffs).toHaveLength(4);
  expect(result.current.diffs[0].field).toBe('title');
});

it('should fetch diffs from the server when no mockData is provided', async () => {
  const mocks = [
    {
      request: {
        query: DIFF_REVISIONS_QUERY,
        variables: { options: { draftId: 'draft-42', fromVersion: 1, toVersion: 2 } },
      },
      result: {
        data: {
          diffRevisions: [
            {
              field: 'title',
              label: 'כותרת',
              before: 'כותרת ישנה',
              after: 'כותרת חדשה',
              changeKind: 'modified',
            },
          ],
        },
      },
    },
  ];

  const { result } = renderHook(() => useDiff('draft-42', 1, 2), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.diffs).toHaveLength(1);
  expect(result.current.diffs[0].changeKind).toBe('modified');
});
