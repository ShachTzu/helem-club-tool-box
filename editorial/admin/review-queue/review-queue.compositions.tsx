import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ReviewQueue } from './review-queue.js';
import {
  mockReviewQueueNow,
  mockReviewQueueModerator,
  mockReviewQueueDrafts,
  mockReviewQueueDecisions,
} from './review-queue.mock.js';

/**
 * a queue with six drafts awaiting a decision, two of them overdue.
 */
export const QueueWithPendingDrafts = () => {
  return (
    <MockProvider>
      <ReviewQueue
        mockUser={mockReviewQueueModerator}
        mockPendingDrafts={mockReviewQueueDrafts}
        mockDecisions={mockReviewQueueDecisions}
        now={mockReviewQueueNow}
      />
    </MockProvider>
  );
};

/**
 * an empty queue — everything submitted has already been decided.
 */
export const EmptyQueue = () => {
  return (
    <MockProvider>
      <ReviewQueue
        mockUser={mockReviewQueueModerator}
        mockPendingDrafts={[]}
        mockDecisions={[]}
        now={mockReviewQueueNow}
      />
    </MockProvider>
  );
};

/**
 * the queue while drafts are loading.
 */
export const LoadingQueue = () => {
  return (
    <MockProvider>
      <ReviewQueue
        mockUser={mockReviewQueueModerator}
        mockPendingDrafts={[]}
        mockDecisions={[]}
        mockLoading
        now={mockReviewQueueNow}
      />
    </MockProvider>
  );
};
