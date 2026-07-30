import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { RsvpButton } from './rsvp-button.js';

const EVENT_ID = `evt-community-meetup`;

const MOCK_USER = {
  id: `user-1`,
  email: `sam.doe@example.com`,
  displayName: `Sam Doe`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-01-15T09:30:00.000Z`).toISOString(),
};

export const AnonymousVisitor = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <RsvpButton
          eventId={EVENT_ID}
          mockData={{ user: null, rsvps: [] }}
          onLoginRequired={() => setShowLoginPrompt(true)}
        />
        {showLoginPrompt && (
          <p style={{ marginTop: 16, color: `#4F6D7A`, fontSize: 14 }}>
            נדרשת התחברות כדי לאשר הגעה לאירוע 🔐
          </p>
        )}
      </div>
    </MockProvider>
  );
};

export const MemberNotAttending = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
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
              {
                id: `rsvp-2`,
                eventId: EVENT_ID,
                userId: `user-3`,
                attending: true,
                createdAt: new Date(`2024-05-02T09:00:00.000Z`).toISOString(),
              },
            ],
          }}
        />
      </div>
    </MockProvider>
  );
};

export const MemberAttending = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
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
              {
                id: `rsvp-2`,
                eventId: EVENT_ID,
                userId: `user-4`,
                attending: true,
                createdAt: new Date(`2024-05-02T09:00:00.000Z`).toISOString(),
              },
              {
                id: `rsvp-3`,
                eventId: EVENT_ID,
                userId: `user-5`,
                attending: true,
                createdAt: new Date(`2024-05-03T09:00:00.000Z`).toISOString(),
              },
            ],
          }}
        />
      </div>
    </MockProvider>
  );
};
