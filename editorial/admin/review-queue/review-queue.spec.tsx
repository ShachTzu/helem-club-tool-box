import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ReviewQueue } from './review-queue.js';
import {
  mockReviewQueueNow,
  mockReviewQueueModerator,
  mockReviewQueueDrafts,
  mockReviewQueueDecisions,
} from './review-queue.mock.js';
import { waitingDays, waitingLabel, isOverdue } from './waiting-time.js';
import styles from './review-queue.module.scss';

it('should render a row per draft awaiting review', () => {
  const { container } = render(
    <MockProvider>
      <ReviewQueue
        mockUser={mockReviewQueueModerator}
        mockPendingDrafts={mockReviewQueueDrafts}
        mockDecisions={mockReviewQueueDecisions}
        now={mockReviewQueueNow}
      />
    </MockProvider>
  );

  // the responsive table renders each row twice — once for the desktop
  // layout and once for the stacked mobile layout.
  const waitingCells = container.querySelectorAll(`.${styles.waiting}`);
  expect(waitingCells.length).toBe(mockReviewQueueDrafts.length * 2);
});

it('should flag drafts that waited past the overdue threshold', () => {
  const { container } = render(
    <MockProvider>
      <ReviewQueue
        mockUser={mockReviewQueueModerator}
        mockPendingDrafts={mockReviewQueueDrafts}
        mockDecisions={mockReviewQueueDecisions}
        now={mockReviewQueueNow}
      />
    </MockProvider>
  );

  const overdue = container.querySelectorAll(`.${styles.waitingOverdue}`);
  expect(overdue.length).toBeGreaterThan(0);
});

it('should show an empty state when nothing awaits review', () => {
  const { container } = render(
    <MockProvider>
      <ReviewQueue
        mockUser={mockReviewQueueModerator}
        mockPendingDrafts={[]}
        mockDecisions={[]}
        now={mockReviewQueueNow}
      />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.stateBlock}`)).toBeTruthy();
});

it('should compute waiting time in whole days', () => {
  const now = new Date('2024-05-10T09:00:00.000Z');
  expect(waitingDays('2024-05-08T09:00:00.000Z', now)).toBe(2);
  expect(waitingLabel('2024-05-08T09:00:00.000Z', now)).toBe('ממתין יומיים');
  expect(isOverdue('2024-05-08T09:00:00.000Z', now)).toBe(false);
  expect(isOverdue('2024-04-20T09:00:00.000Z', now)).toBe(true);
});
