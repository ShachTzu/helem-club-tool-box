import { canReview, canPublish } from './approval-permissions.js';

it('allows a moderator to review drafts', () => {
  const moderator = { isAtLeast: (role: string) => role === 'moderator' || role === 'member' || role === 'writer' };
  expect(canReview(moderator)).toBe(true);
});

it('does not allow a writer to review drafts', () => {
  const writer = { isAtLeast: (role: string) => role === 'member' || role === 'writer' };
  expect(canReview(writer)).toBe(false);
});

it('allows an admin to publish drafts', () => {
  const admin = { isAtLeast: () => true };
  expect(canPublish(admin)).toBe(true);
});

it('does not allow a member to publish drafts', () => {
  const member = { isAtLeast: (role: string) => role === 'member' };
  expect(canPublish(member)).toBe(false);
});

it('returns false for canReview and canPublish when no user is provided', () => {
  expect(canReview(undefined)).toBe(false);
  expect(canPublish(null)).toBe(false);
});
