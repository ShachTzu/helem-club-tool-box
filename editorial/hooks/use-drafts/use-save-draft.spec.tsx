import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useSaveDraft, SAVE_DRAFT_MUTATION } from './use-save-draft.js';

const savedRawDraft = {
  id: 'draft-1',
  contentType: 'post',
  title: 'כותרת לדוגמה',
  payload: { body: 'תוכן לדוגמה' },
  domains: ['רווחה נפשית'],
  status: 'draft',
  authorId: 'user-1',
  authorName: 'ישראל ישראלי',
  currentVersion: 1,
  createdAt: '2024-05-01T08:30:00.000Z',
  updatedAt: '2024-05-01T08:30:00.000Z',
};

const saveDraftMock = {
  request: {
    query: SAVE_DRAFT_MUTATION,
    variables: {
      options: {
        contentType: 'post',
        title: 'כותרת לדוגמה',
        payload: { body: 'תוכן לדוגמה' },
        domains: ['רווחה נפשית'],
      },
    },
  },
  result: {
    data: {
      saveDraft: savedRawDraft,
    },
  },
};

it('should save a draft and return the saved entity', async () => {
  const { result } = renderHook(() => useSaveDraft(), {
    wrapper: ({ children }) => <MockProvider mocks={[saveDraftMock]}>{children}</MockProvider>,
  });

  let saved;
  await act(async () => {
    saved = await result.current.saveDraft({
      contentType: 'post',
      title: 'כותרת לדוגמה',
      payload: { body: 'תוכן לדוגמה' },
      domains: ['רווחה נפשית'],
    });
  });

  expect(saved?.id).toBe('draft-1');
  expect(saved?.title).toBe('כותרת לדוגמה');
});

it('should not send an autosave request before the debounce delay elapses', () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSaveDraft(), {
    wrapper: ({ children }) => <MockProvider mocks={[saveDraftMock]}>{children}</MockProvider>,
  });

  act(() => {
    result.current.scheduleAutosave(
      {
        contentType: 'post',
        title: 'כותרת לדוגמה',
        payload: { body: 'תוכן לדוגמה' },
        domains: ['רווחה נפשית'],
      },
      1000
    );
  });

  expect(result.current.saving).toBe(false);

  vi.useRealTimers();
});

it('should reset the debounce timer when scheduling autosave again before it fires', () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSaveDraft(), {
    wrapper: ({ children }) => <MockProvider mocks={[saveDraftMock]}>{children}</MockProvider>,
  });

  act(() => {
    result.current.scheduleAutosave(
      {
        contentType: 'post',
        title: 'כותרת ראשונה',
        payload: { body: 'תוכן לדוגמה' },
      },
      1000
    );
    vi.advanceTimersByTime(500);
    result.current.scheduleAutosave(
      {
        contentType: 'post',
        title: 'כותרת אחרונה',
        payload: { body: 'תוכן לדוגמה' },
      },
      1000
    );
    vi.advanceTimersByTime(500);
  });

  vi.useRealTimers();

  expect(result.current.saving).toBe(false);
});

it('should cancel a pending autosave', () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSaveDraft(), {
    wrapper: ({ children }) => <MockProvider mocks={[saveDraftMock]}>{children}</MockProvider>,
  });

  act(() => {
    result.current.scheduleAutosave(
      {
        contentType: 'post',
        title: 'כותרת לדוגמה',
        payload: { body: 'תוכן לדוגמה' },
      },
      1000
    );
    result.current.cancelAutosave();
    vi.advanceTimersByTime(1000);
  });

  vi.useRealTimers();

  expect(result.current.saving).toBe(false);
});
