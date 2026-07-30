import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvent } from '@helemclub/events.entities.event';
import { EventSchedule } from './event-schedule.js';

const upcomingRoundTable = mockEvent({
  slug: `round-table-shame`,
  title: `שולחן עגול: בושה ואשמה`,
  description: `מפגש פתוח בהנחיית אנשי מקצוע ומתמודדים סביב נושא הבושה.`,
  type: `round_table`,
  coverImage: `https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80`,
  startAt: `2026-06-04T19:00:00.000Z`,
  location: `זום`,
  isOnline: true,
  domains: [`אשמה, בושה וביקורת עצמית`, `ויסות רגשי`],
}).toObject();

const upcomingWebinar = mockEvent({
  slug: `webinar-sleep`,
  title: `וובינר: שינה וטראומה`,
  description: `הרצאה מקצועית על הקשר בין פוסט-טראומה להפרעות שינה + שאלות.`,
  type: `webinar`,
  coverImage: `https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&w=900&q=80`,
  startAt: `2026-06-18T20:30:00.000Z`,
  location: `זום`,
  isOnline: true,
  domains: [`שינה`, `חרדה`],
}).toObject();

const upcomingLocal = mockEvent({
  slug: `local-tlv`,
  title: `מפגש קהילה — תל אביב`,
  description: `מפגש פנים אל פנים לחברי הקהילה באזור המרכז, באווירה רגועה.`,
  type: `local`,
  coverImage: `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80`,
  startAt: `2026-07-09T18:00:00.000Z`,
  location: `תל אביב`,
  isOnline: false,
  domains: [`בדידות וחיבור חברתי`],
}).toObject();

const pastConference = mockEvent({
  slug: `big-conference`,
  title: `כנס הלם קלאב השנתי`,
  description: `יום שלם של הרצאות, סדנאות ומפגשים — הקהילה נפגשת.`,
  type: `big`,
  coverImage: `https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80`,
  startAt: `2023-11-02T09:00:00.000Z`,
  location: `מרכז הכנסים, תל אביב`,
  isOnline: false,
  domains: [`בדידות וחיבור חברתי`, `הכרה`],
  recordingRecordId: `life-after-panel`,
}).toObject();

export const BasicEventSchedule = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <EventSchedule events={[upcomingRoundTable, upcomingWebinar, upcomingLocal, pastConference]} />
      </div>
    </MockProvider>
  );
};

export const PastTabByDefault = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <EventSchedule
          events={[upcomingRoundTable, upcomingWebinar, upcomingLocal, pastConference]}
          defaultTab="past"
          title="ארכיון האירועים"
          description="הקלטות ותיעוד של מפגשי הקהילה מהעבר."
        />
      </div>
    </MockProvider>
  );
};

export const EmptyEventSchedule = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <EventSchedule events={[]} title="לוח אירועים" description="עדיין לא פורסמו אירועים." />
      </div>
    </MockProvider>
  );
};
