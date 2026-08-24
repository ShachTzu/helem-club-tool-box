import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockApprovalEntries } from '@helemclub/editorial.entities.approval-entry';
import { useApprovalTrail } from './use-approval-trail.js';
import { canReview, canPublish } from './approval-permissions.js';

function wrapper({ children }: React.PropsWithChildren) {
  return <MockProvider>{children}</MockProvider>;
}

describe('useApprovalTrail', () => {
  it('should return the entries provided as mock data', () => {
    const mockEntries = mockApprovalEntries();

    const { result } = renderHook(() => useApprovalTrail('draft-1', { mockData: mockEntries }), {
      wrapper,
    });

    expect(result.current.entries).toHaveLength(mockEntries.length);
    expect(result.current.loading).toBe(false);
  });

  it('should return an empty trail when no mock data is provided', () => {
    const { result } = renderHook(() => useApprovalTrail('draft-1', { mockData: [] }), {
      wrapper,
    });

    expect(result.current.entries).toHaveLength(0);
  });

  it('should expose the Hebrew action label of each entry', () => {
    const mockEntries = mockApprovalEntries();

    const { result } = renderHook(() => useApprovalTrail('draft-1', { mockData: mockEntries }), {
      wrapper,
    });

    expect(result.current.entries[0].actionLabel()).toBe('נוצר');
  });
});

describe('canReview', () => {
  it('should allow a moderator to review', () => {
    const moderator = { isAtLeast: (role: string) => role === 'moderator' };
    expect(canReview(moderator)).toBe(true);
  });

  it('should not allow a plain member to review', () => {
    const member = { isAtLeast: () => false };
    expect(canReview(member)).toBe(false);
  });

  it('should not allow a missing user to review', () => {
    expect(canReview(undefined)).toBe(false);
  });
});

describe('canPublish', () => {
  it('should allow a moderator to publish', () => {
    const moderator = { isAtLeast: (role: string) => role === 'moderator' };
    expect(canPublish(moderator)).toBe(true);
  });

  it('should not allow a missing user to publish', () => {
    expect(canPublish(null)).toBe(false);
  });
});
