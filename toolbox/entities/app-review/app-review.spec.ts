import { AppReview } from './app-review.js';
import { mockAppReview, mockAppReviews } from './app-review.mock.js';

it('has an AppReview.from() method', () => {
  expect(AppReview.from).toBeTruthy();
});

it('should create an AppReview instance from a plain object', () => {
  const review = AppReview.from({
    id: 'r1',
    appId: 'ground-me',
    stars: 5,
    comment: 'מעולה',
    displayName: 'דנה',
    helpfulCount: 10,
    createdAt: '2024-01-01T00:00:00.000Z',
  });

  expect(review).toBeInstanceOf(AppReview);
  expect(review.id).toEqual('r1');
  expect(review.appId).toEqual('ground-me');
  expect(review.stars).toEqual(5);
  expect(review.comment).toEqual('מעולה');
  expect(review.displayName).toEqual('דנה');
  expect(review.helpfulCount).toEqual(10);
  expect(review.createdAt).toEqual('2024-01-01T00:00:00.000Z');
});

it('should default helpfulCount to 0 when not provided', () => {
  const review = AppReview.from({
    id: 'r2',
    appId: 'ground-me',
    stars: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
  } as any);

  expect(review.helpfulCount).toEqual(0);
});

it('should serialize an AppReview into a plain object using toObject()', () => {
  const review = mockAppReview({ id: 'r3' });
  const plain = review.toObject();

  expect(plain).toEqual({
    id: 'r3',
    appId: review.appId,
    stars: review.stars,
    comment: review.comment,
    displayName: review.displayName,
    helpfulCount: review.helpfulCount,
    createdAt: review.createdAt,
  });
});

it('should support optional comment and displayName', () => {
  const review = mockAppReview({ comment: undefined, displayName: undefined });

  expect(review.comment).toBeUndefined();
  expect(review.displayName).toBeUndefined();
});

it('mockAppReviews() should return a list of AppReview instances', () => {
  const reviews = mockAppReviews();

  expect(reviews).toHaveLength(3);
  reviews.forEach((review) => {
    expect(review).toBeInstanceOf(AppReview);
  });
});
