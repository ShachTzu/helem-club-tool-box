import { Comment } from './comment.js';
import { mockComment, mockComments } from './comment.mock.js';

it('has a Comment.from() method', () => {
  expect(Comment.from).toBeTruthy();
});

it('creates a Comment from a plain object', () => {
  const comment = Comment.from({
    id: 'c1',
    targetType: 'app',
    targetId: 'app-1',
    text: 'hello world',
    createdAt: '2024-01-01T00:00:00.000Z',
    displayName: 'John',
  });

  expect(comment.id).toEqual('c1');
  expect(comment.targetType).toEqual('app');
  expect(comment.targetId).toEqual('app-1');
  expect(comment.text).toEqual('hello world');
  expect(comment.displayName).toEqual('John');
  expect(comment.isAnonymous).toEqual(false);
  expect(comment.membersOnly).toEqual(false);
  expect(comment.reportCount).toEqual(0);
  expect(comment.hidden).toEqual(false);
});

it('serializes a Comment into a plain object with an id', () => {
  const comment = Comment.from({
    id: 'c2',
    targetType: 'blog',
    targetId: 'post-1',
    text: 'nice post',
    createdAt: '2024-02-02T00:00:00.000Z',
    userId: 'u1',
  });

  const plainComment = comment.toObject();

  expect(plainComment.id).toEqual('c2');
  expect(plainComment.targetType).toEqual('blog');
  expect(plainComment.targetId).toEqual('post-1');
  expect(plainComment.text).toEqual('nice post');
  expect(plainComment.userId).toEqual('u1');
  expect(plainComment.createdAt).toEqual('2024-02-02T00:00:00.000Z');
});

it('round-trips a Comment through toObject() and from()', () => {
  const original = mockComment({ id: 'round-trip' });
  const roundTripped = Comment.from(original.toObject());

  expect(roundTripped.toObject()).toEqual(original.toObject());
});

it('has a mockComments() factory that returns a list of comments', () => {
  const comments = mockComments();

  expect(comments.length).toBeGreaterThan(0);
  comments.forEach((comment) => {
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toBeTruthy();
  });
});

it('supports anonymous, hidden and reported comments via overrides', () => {
  const comment = mockComment({ isAnonymous: true, userId: undefined, deviceId: 'device-1', hidden: true, reportCount: 5 });

  expect(comment.isAnonymous).toEqual(true);
  expect(comment.userId).toBeUndefined();
  expect(comment.deviceId).toEqual('device-1');
  expect(comment.hidden).toEqual(true);
  expect(comment.reportCount).toEqual(5);
});
