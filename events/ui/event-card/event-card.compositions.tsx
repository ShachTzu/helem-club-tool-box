import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvent } from '@helemclub/events.entities.event';
import { EventCard } from './event-card.js';

const roundTableEvent = mockEvent({
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

const localEvent = mockEvent({
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

const webinarEvent = mockEvent({
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

export const BasicEventCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 340 }}>
        <EventCard event={roundTableEvent} />
      </div>
    </MockProvider>
  );
};

export const InPersonEventCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 340 }}>
        <EventCard event={localEvent} />
      </div>
    </MockProvider>
  );
};

export const EventCardsGrid = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 18,
        }}
      >
        <EventCard event={roundTableEvent} />
        <EventCard event={webinarEvent} />
        <EventCard event={localEvent} />
      </div>
    </MockProvider>
  );
};
