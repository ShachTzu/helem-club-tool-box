import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockSavedItem } from '@helemclub/engagement.entities.saved-item';
import { useSaved } from './use-saved.js';

it('should save a new target and mark it as saved', () => {
  const { result } = renderHook(() => useSaved({ mockDeviceId: 'device-save-test' }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.isSaved('app', 'calm-space')).toBe(false);

  act(() => {
    result.current.save({
      targetType: 'app',
      targetId: 'calm-space',
      title: 'Calm Space',
      url: '/toolbox/calm-space',
    });
  });

  expect(result.current.isSaved('app', 'calm-space')).toBe(true);
  expect(result.current.savedItems).toHaveLength(1);
  expect(result.current.savedItems[0].title).toBe('Calm Space');
});

it('should unsave a previously saved target', () => {
  const { result } = renderHook(() => useSaved({ mockDeviceId: 'device-unsave-test' }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  act(() => {
    result.current.save({
      targetType: 'article',
      targetId: 'article-42',
      title: 'מאמר',
      url: '/blog/article-42',
    });
  });

  expect(result.current.isSaved('article', 'article-42')).toBe(true);

  act(() => {
    result.current.unsave('article', 'article-42');
  });

  expect(result.current.isSaved('article', 'article-42')).toBe(false);
  expect(result.current.savedItems).toHaveLength(0);
});

it('should toggle save state on toggleSave', () => {
  const { result } = renderHook(() => useSaved({ mockDeviceId: 'device-toggle-test' }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  const target = {
    targetType: 'event' as const,
    targetId: 'event-7',
    title: 'מפגש קהילתי',
    url: '/events/event-7',
  };

  act(() => {
    result.current.toggleSave(target);
  });
  expect(result.current.isSaved('event', 'event-7')).toBe(true);

  act(() => {
    result.current.toggleSave(target);
  });
  expect(result.current.isSaved('event', 'event-7')).toBe(false);
});

it('should not duplicate an already saved target', () => {
  const { result } = renderHook(() => useSaved({ mockDeviceId: 'device-dup-test' }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  const target = {
    targetType: 'domain' as const,
    targetId: 'domain-1',
    title: 'דומיין',
    url: '/domains/domain-1',
  };

  act(() => {
    result.current.save(target);
  });
  act(() => {
    result.current.save(target);
  });

  expect(result.current.savedItems).toHaveLength(1);
});

it('should use provided mock saved items instead of local storage', () => {
  const items = [mockSavedItem({ id: 'saved-1', title: 'שמור לדוגמה' })];

  const { result } = renderHook(
    () => useSaved({ mockDeviceId: 'device-mock-test', mockSavedItems: items }),
    {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    }
  );

  expect(result.current.savedItems).toHaveLength(1);
  expect(result.current.savedItems[0].title).toBe('שמור לדוגמה');
});
