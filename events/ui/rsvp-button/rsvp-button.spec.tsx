import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { RsvpButton } from './rsvp-button.js';
import styles from './rsvp-button.module.scss';

const EVENT_ID = `evt-1`;

const MOCK_USER = {
  id: `user-1`,
  email: `sam.doe@example.com`,
  displayName: `Sam Doe`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-01-15T09:30:00.000Z`).toISOString(),
};

it(`should prompt login for anonymous visitors when clicked`, () => {
  const handleLoginRequired = vi.fn();
  const { container } = render(
    <MockProvider>
      <RsvpButton
        eventId={EVENT_ID}
        mockData={{ user: null, rsvps: [] }}
        onLoginRequired={() => handleLoginRequired()}
      />
    </MockProvider>
  );

  const button = container.querySelector(`button`) as HTMLButtonElement;
  fireEvent.click(button);

  expect(handleLoginRequired).toHaveBeenCalledTimes(1);
});

it(`should show the attending count for a member who is not attending`, () => {
  const { container } = render(
    <MockProvider>
      <RsvpButton
        eventId={EVENT_ID}
        mockData={{
          user: MOCK_USER,
          rsvps: [
            {
              id: `rsvp-1`,
              eventId: EVENT_ID,
              userId: `user-2`,
              attending: true,
              createdAt: new Date(`2024-05-01T09:00:00.000Z`).toISOString(),
            },
          ],
        }}
      />
    </MockProvider>
  );

  const count = container.querySelector(`.${styles.count}`);
  expect(count?.textContent).toContain(`1`);
  expect(count?.classList.contains(styles.countAttending)).toBe(false);
});

it(`should mark the current member as attending`, () => {
  const { container } = render(
    <MockProvider>
      <RsvpButton
        eventId={EVENT_ID}
        mockData={{
          user: MOCK_USER,
          rsvps: [
            {
              id: `rsvp-1`,
              eventId: EVENT_ID,
              userId: MOCK_USER.id,
              attending: true,
              createdAt: new Date(`2024-05-01T09:00:00.000Z`).toISOString(),
            },
          ],
        }}
      />
    </MockProvider>
  );

  const count = container.querySelector(`.${styles.count}`);
  expect(count?.classList.contains(styles.countAttending)).toBe(true);
});
