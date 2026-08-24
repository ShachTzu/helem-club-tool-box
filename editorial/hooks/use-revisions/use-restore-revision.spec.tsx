import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useRestoreRevision, RESTORE_REVISION_MUTATION } from './use-restore-revision.js';

it('should restore a revision and return the resulting draft', async () => {
  const mocks = [
    {
      request: {
        query: RESTORE_REVISION_MUTATION,
        variables: () => true,
      },
      result: {
        data: {
          restoreRevision: {
            __typename: 'Draft',
            id: 'draft-42',
            title: 'מדריך התחלה מהירה',
            currentVersion: 5,
            updatedAt: '2024-01-05T10:00:00.000Z',
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ];

  const { result } = renderHook(() => useRestoreRevision(), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  expect(result.current.restoring).toBe(false);

  let restoredDraft;
  await act(async () => {
    restoredDraft = await result.current.restoreRevision({ draftId: 'draft-42', versionNumber: 2 });
  });

  await waitFor(() => {
    expect(result.current.restoring).toBe(false);
  });

  expect(restoredDraft).toMatchObject({
    id: 'draft-42',
    title: 'מדריך התחלה מהירה',
    currentVersion: 5,
    updatedAt: '2024-01-05T10:00:00.000Z',
  });
});
