import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageEvents } from './manage-events.js';
import {
  MOCK_MANAGE_EVENTS,
  MOCK_MANAGE_EVENTS_LABELS,
  MOCK_MANAGE_EVENTS_DOMAINS,
} from './manage-events-fixtures.mock.js';

export const AdminViewingAllEvents = () => {
  const admin = {
    id: `admin-1`,
    email: `admin@helamclub.co.il`,
    displayName: `הלם אדמין`,
    role: `admin` as const,
    provider: `email` as const,
    createdAt: new Date().toISOString(),
  };

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageEvents
          mockEvents={MOCK_MANAGE_EVENTS}
          mockLabels={MOCK_MANAGE_EVENTS_LABELS}
          mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
          mockUser={admin}
        />
      </div>
    </MockProvider>
  );
};

export const EmptyEventsList = () => {
  const admin = {
    id: `admin-2`,
    email: `admin2@helamclub.co.il`,
    displayName: `נועה מהצוות`,
    role: `admin` as const,
    provider: `email` as const,
    createdAt: new Date().toISOString(),
  };

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageEvents
          mockEvents={[]}
          mockLabels={MOCK_MANAGE_EVENTS_LABELS}
          mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
          mockUser={admin}
        />
      </div>
    </MockProvider>
  );
};

export const RestrictedForMember = () => {
  const member = {
    id: `member-1`,
    email: `member@helamclub.co.il`,
    displayName: `חבר קהילה`,
    role: `member` as const,
    provider: `email` as const,
    createdAt: new Date().toISOString(),
  };

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageEvents
          mockEvents={MOCK_MANAGE_EVENTS}
          mockLabels={MOCK_MANAGE_EVENTS_LABELS}
          mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
          mockUser={member}
        />
      </div>
    </MockProvider>
  );
};
