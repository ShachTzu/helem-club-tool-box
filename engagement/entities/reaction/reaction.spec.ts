import { Reaction } from './reaction.js';
import { mockReaction, mockReactions } from './reaction.mock.js';

it('has a Reaction.from() method', () => {
  expect(Reaction.from).toBeTruthy();
});

it('creates a Reaction from a plain object', () => {
  const reaction = Reaction.from({
    id: 'r1',
    targetType: 'post',
    targetId: 'post-1',
    type: 'like',
    deviceId: 'device-1',
    createdAt: '2024-01-01T00:00:00.000Z',
  });

  expect(reaction.id).toEqual('r1');
  expect(reaction.targetType).toEqual('post');
  expect(reaction.targetId).toEqual('post-1');
  expect(reaction.type).toEqual('like');
  expect(reaction.deviceId).toEqual('device-1');
  expect(reaction.createdAt).toEqual('2024-01-01T00:00:00.000Z');
});

it('applies default values for optional properties', () => {
  const reaction = Reaction.from({ id: 'r2' });

  expect(reaction.targetType).toEqual('post');
  expect(reaction.targetId).toEqual('');
  expect(reaction.type).toEqual('like');
  expect(reaction.deviceId).toEqual('');
  expect(typeof reaction.createdAt).toEqual('string');
});

it('serializes a Reaction into a plain object with toObject()', () => {
  const reaction = Reaction.from({
    id: 'r3',
    targetType: 'record',
    targetId: 'record-1',
    type: 'heart',
    deviceId: 'device-2',
    createdAt: '2024-02-02T00:00:00.000Z',
  });

  expect(reaction.toObject()).toEqual({
    id: 'r3',
    targetType: 'record',
    targetId: 'record-1',
    type: 'heart',
    deviceId: 'device-2',
    createdAt: '2024-02-02T00:00:00.000Z',
  });
});

it('returns an id in toObject() matching the entity id', () => {
  const reaction = mockReaction({ id: 'r4' });
  expect(reaction.toObject().id).toEqual('r4');
});

it('mockReaction() creates a valid Reaction with overrides', () => {
  const reaction = mockReaction({ type: 'hug', targetType: 'event' });

  expect(reaction).toBeInstanceOf(Reaction);
  expect(reaction.type).toEqual('hug');
  expect(reaction.targetType).toEqual('event');
});

it('mockReactions() creates a list of Reactions', () => {
  const reactions = mockReactions();

  expect(reactions.length).toBeGreaterThan(0);
  reactions.forEach((reaction) => {
    expect(reaction).toBeInstanceOf(Reaction);
  });
});
