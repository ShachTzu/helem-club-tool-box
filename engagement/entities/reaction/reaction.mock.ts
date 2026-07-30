import { v4 as uuid } from 'uuid';
import { Reaction, PlainReaction } from './reaction.js';

/**
 * create a mock Reaction with optional property overrides.
 */
export function mockReaction(overrides: Partial<PlainReaction> = {}): Reaction {
  return Reaction.from({
    id: uuid(),
    targetType: 'post',
    targetId: 'post-finding-calm-in-the-storm',
    type: 'like',
    deviceId: `device-${uuid()}`,
    createdAt: new Date().toISOString(),
    ...overrides,
  });
}

/**
 * create a list of mock Reactions for a shared target, useful for
 * previewing aggregated reaction summaries in the UI.
 */
export function mockReactions(): Reaction[] {
  return [
    mockReaction({ type: 'like', targetType: 'post', targetId: 'post-finding-calm-in-the-storm' }),
    mockReaction({ type: 'heart', targetType: 'post', targetId: 'post-finding-calm-in-the-storm' }),
    mockReaction({ type: 'hug', targetType: 'record', targetId: 'record-grounding-technique' }),
    mockReaction({ type: 'like', targetType: 'event', targetId: 'event-community-circle' }),
    mockReaction({ type: 'star', targetType: 'app', targetId: 'app-breathe-easy' }),
  ];
}
