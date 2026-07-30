import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { EngagementBar } from './engagement-bar.js';

const activeReactions = {
  counts: [
    { type: `like`, count: 24 },
    { type: `heart`, count: 6 },
    { type: `hug`, count: 3 },
  ],
  myReaction: `like`,
};

const quietReactions = {
  counts: [
    { type: `like`, count: 3 },
  ],
  myReaction: undefined,
};

const sampleComments = [
  {
    id: `c1`,
    targetType: `post`,
    targetId: `post-finding-calm-in-the-storm`,
    text: `תודה על השיתוף, ממש עזר לי הבוקר.`,
    displayName: `מיכל ר.`,
    isAnonymous: false,
    membersOnly: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: `c2`,
    targetType: `post`,
    targetId: `post-finding-calm-in-the-storm`,
    text: `לקח לי זמן להבין שאני לא לבד עם זה.`,
    isAnonymous: true,
    membersOnly: false,
    createdAt: new Date().toISOString(),
  },
];

export const BasicEngagementBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 720 }}>
        <EngagementBar
          targetType="post"
          targetId="post-finding-calm-in-the-storm"
          title="שביל ההחלמה מהתגובתיות"
          url="https://helam.club/blog/hachlama-mehatgobut"
          mockReactions={activeReactions}
          mockComments={sampleComments}
          mockDeviceId="composition-basic"
        />
      </div>
    </MockProvider>
  );
};

export const AppEngagementBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 720 }}>
        <EngagementBar
          targetType="app"
          targetId="calm-space"
          title="Calm Space"
          url="https://helam.club/toolbox/calm-space"
          mockReactions={quietReactions}
          mockComments={[]}
          mockDeviceId="composition-app"
        />
      </div>
    </MockProvider>
  );
};

export const EngagementBarWithCustomCommentsHandler = () => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 720 }}>
        <EngagementBar
          targetType="event"
          targetId="event-community-circle"
          title="מפגש תמיכה חודשי"
          url="https://helam.club/events/mifgash-tmicha"
          mockReactions={quietReactions}
          mockComments={sampleComments}
          mockDeviceId="composition-event"
          onCommentsClick={() => setClicked(true)}
        />
        {clicked && <p style={{ marginTop: 12, color: 'var(--colors-text-secondary)' }}>נלחץ על התגובות</p>}
      </div>
    </MockProvider>
  );
};
