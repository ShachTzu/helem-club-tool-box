import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { MembersOnlyGate } from './members-only-gate.js';

const memberMock = {
  id: `user-1`,
  email: `dana@helam.club`,
  displayName: `דנה כהן`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: `2025-01-12T08:00:00.000Z`,
};

export const SignedOutGate = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32 }}>
        <MembersOnlyGate mockData={null} />
      </div>
    </MockProvider>
  );
};

export const SignedInMemberGate = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32 }}>
        <MembersOnlyGate mockData={memberMock}>
          <Paragraph>
            תוכן בלעדי לחברי הקהילה: מפגש תמיכה חודשי, הקלטת ההרצאה המלאה וחוברת תרגול להורדה.
          </Paragraph>
        </MembersOnlyGate>
      </div>
    </MockProvider>
  );
};

export const CustomJoinMessageGate = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32 }}>
        <MembersOnlyGate
          mockData={null}
          title="הפרק המלא שמור לחברי הקהילה"
          description="פרקי הפודקאסט המלאים, כולל שיחות עומק עם מטפלים ובוגרים, פתוחים לחברי קהילת הלם קלאב בלבד."
          joinLabel="הצטרפו לקהילה בחינם"
          joinHref="/onboarding"
        />
      </div>
    </MockProvider>
  );
};
