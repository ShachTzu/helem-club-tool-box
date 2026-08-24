import { renderHook, waitFor, act } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { useReviewActions, SUBMIT_FOR_REVIEW_MUTATION, APPROVE_DRAFT_MUTATION } from './use-review-actions.js';

const draft = mockDrafts()[0];

const rawDraft = {
  id: draft.id,
  contentType: draft.contentType,
  contentRef: draft.contentRef || null,
  title: draft.title,
  payload: JSON.stringify(draft.payload),
  domains: draft.domains,
  status: 'in_review',
  authorId: draft.authorId,
  authorName: draft.authorName,
  currentVersion: draft.currentVersion,
  createdAt: draft.createdAt,
  updatedAt: draft.updatedAt,
  submittedAt: draft.updatedAt,
  publishedAt: null,
  lastReviewerId: null,
  lastReviewNote: null,
};

it('submits a draft for review and returns the updated draft', async () => {
  const mocks = [
    {
      request: {
        query: SUBMIT_FOR_REVIEW_MUTATION,
        variables: { options: { draftId: draft.id, note: undefined } },
      },
      result: {
        data: { submitForReview: rawDraft },
      },
    },
  ];

  const { result } = renderHook(() => useReviewActions(), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  let updated;
  await act(async () => {
    updated = await result.current.submitForReview({ draftId: draft.id });
  });

  expect(updated?.status).toBe('in_review');
  expect(updated?.id).toBe(draft.id);
});

it('sets a Hebrew error message when approving a draft fails', async () => {
  const mocks = [
    {
      request: {
        query: APPROVE_DRAFT_MUTATION,
        variables: { options: { draftId: draft.id, note: 'מאושר' } },
      },
      error: new Error('network error'),
    },
  ];

  const { result } = renderHook(() => useReviewActions(), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  await act(async () => {
    await result.current.approveDraft({ draftId: draft.id, note: 'מאושר' });
  });

  await waitFor(() => {
    expect(result.current.error).toBe('אירעה שגיאה בביצוע הפעולה. נסו שוב מאוחר יותר.');
  });
});
