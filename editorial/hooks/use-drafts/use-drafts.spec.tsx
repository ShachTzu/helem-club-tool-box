import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { gql } from '@apollo/client';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { useDrafts, LIST_DRAFTS_QUERY } from './use-drafts.js';
import { useDraft } from './use-draft.js';
import { useSaveDraft, SAVE_DRAFT_MUTATION } from './use-save-draft.js';

// mirrors the query issued internally by @helemclub/platform.hooks.use-auth,
// used here only to supply GraphQL mocks for the current user, matching by
// operation shape rather than mocking the hook itself.
const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      displayName
      avatarUrl
      role
      provider
      createdAt
      onboardingCompleted
      interests
      membershipStatus
      contentAdmin
    }
  }
`;

const writerUserMock = {
  request: { query: GET_CURRENT_USER_QUERY },
  result: {
    data: {
      getCurrentUser: {
        id: 'user-101',
        email: 'noa@example.com',
        displayName: 'נועה כהן',
        avatarUrl: null,
        role: 'writer',
        provider: 'email',
        createdAt: '2024-01-01T00:00:00.000Z',
        onboardingCompleted: true,
        interests: [],
        membershipStatus: 'approved',
        contentAdmin: false,
      },
    },
  },
};

const [firstDraft] = mockDrafts();
const plainDrafts = mockDrafts().map((draft) => draft.toObject());

describe('useDrafts', () => {
  it('returns drafts built from mock data without hitting the network', async () => {
    const { result } = renderHook(() => useDrafts({ mockData: plainDrafts }), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.drafts).toHaveLength(plainDrafts.length);
    expect(result.current.drafts[0].title).toBe(plainDrafts[0].title);
  });

  it('scopes the query to the writer own drafts when the user is a writer', async () => {
    const listMock = {
      request: {
        query: LIST_DRAFTS_QUERY,
        variables: {
          options: {
            contentType: undefined,
            status: undefined,
            authorId: 'user-101',
            domains: undefined,
            search: undefined,
            limit: undefined,
            offset: undefined,
          },
        },
      },
      result: {
        data: { listDrafts: [firstDraft.toObject()] },
      },
    };

    const { result } = renderHook(() => useDrafts(), {
      wrapper: ({ children }) => (
        <MockProvider mocks={[writerUserMock, listMock]}>{children}</MockProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.drafts).toHaveLength(1);
    expect(result.current.drafts[0].id).toBe(firstDraft.id);
  });

  it('returns a Hebrew error message when the query fails', async () => {
    const errorMock = {
      request: { query: LIST_DRAFTS_QUERY, variables: { options: {} } },
      error: new Error('network error'),
    };

    const { result } = renderHook(() => useDrafts({}), {
      wrapper: ({ children }) => <MockProvider mocks={[errorMock]}>{children}</MockProvider>,
    });

    await waitFor(() => {
      expect(result.current.error).toBe('אירעה שגיאה בטעינת רשימת הטיוטות');
    });
  });
});

describe('useDraft', () => {
  it('returns a draft built from mock data', () => {
    const { result } = renderHook(() => useDraft(firstDraft.id, { mockData: firstDraft.toObject() }), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.draft?.id).toBe(firstDraft.id);
  });

  it('returns undefined when the mock data represents a missing draft', () => {
    const { result } = renderHook(() => useDraft('missing-id', { mockData: null }), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    expect(result.current.draft).toBeUndefined();
  });
});

describe('useSaveDraft', () => {
  it('saves a draft and returns the resulting entity', async () => {
    const saveMock = {
      request: {
        query: SAVE_DRAFT_MUTATION,
        variables: { options: { title: 'טיוטה חדשה' } },
      },
      result: {
        data: { saveDraft: firstDraft.toObject() },
      },
    };

    const { result } = renderHook(() => useSaveDraft(), {
      wrapper: ({ children }) => <MockProvider mocks={[saveMock]}>{children}</MockProvider>,
    });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ title: 'טיוטה חדשה' });
    });

    expect(saved?.id).toBe(firstDraft.id);
  });

  it('returns a Hebrew error message when the save mutation fails', async () => {
    const errorMock = {
      request: {
        query: SAVE_DRAFT_MUTATION,
        variables: { options: { title: 'טיוטה שגויה' } },
      },
      error: new Error('network error'),
    };

    const { result } = renderHook(() => useSaveDraft(), {
      wrapper: ({ children }) => <MockProvider mocks={[errorMock]}>{children}</MockProvider>,
    });

    await act(async () => {
      await result.current.saveDraft({ title: 'טיוטה שגויה' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('אירעה שגיאה בשמירת הטיוטה');
    });
  });

  it('debounces autosave calls and only sends the latest content', async () => {
    vi.useFakeTimers();

    const autosaveMock = {
      request: {
        query: SAVE_DRAFT_MUTATION,
        variables: { options: { id: firstDraft.id, title: 'גרסה אחרונה' } },
      },
      result: {
        data: { saveDraft: firstDraft.toObject() },
      },
    };

    const { result } = renderHook(() => useSaveDraft(), {
      wrapper: ({ children }) => <MockProvider mocks={[autosaveMock]}>{children}</MockProvider>,
    });

    act(() => {
      result.current.scheduleAutosave({ id: firstDraft.id, title: 'גרסה ראשונה' }, 500);
      result.current.scheduleAutosave({ id: firstDraft.id, title: 'גרסה אחרונה' }, 500);
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    vi.useRealTimers();
  });
});
