import type { ReactionSummary } from './use-reactions.js';

/**
 * a reaction summary with no reactions yet, and no reaction from the
 * current device.
 */
export const emptyReactionSummaryMock: ReactionSummary = {
  counts: [],
  myReaction: undefined,
};

/**
 * a reaction summary with a few reaction types, where the current
 * device has already reacted with "like".
 */
export const likedReactionSummaryMock: ReactionSummary = {
  counts: [
    { type: 'like', count: 24 },
    { type: 'heart', count: 6 },
    { type: 'hug', count: 3 },
  ],
  myReaction: 'like',
};

/**
 * a reaction summary where the current device has not reacted yet.
 */
export const unreactedReactionSummaryMock: ReactionSummary = {
  counts: [
    { type: 'like', count: 11 },
    { type: 'heart', count: 2 },
  ],
  myReaction: undefined,
};
