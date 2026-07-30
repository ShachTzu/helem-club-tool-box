import { v4 as uuidv4 } from 'uuid';
import { Event, type PlainEvent } from './event.js';

const HOUR = 1000 * 60 * 60;

function isoIn(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * HOUR).toISOString();
}

/**
 * create a single mock Event, optionally overriding any of its properties.
 */
export function mockEvent(overrides: Partial<PlainEvent> = {}): Event {
  const plainEvent: PlainEvent = {
    id: uuidv4(),
    slug: 'round-table-shame',
    title: 'שולחן עגול: בושה ואשמה',
    description: 'מפגש פתוח בהנחיית אנשי מקצוע ומתמודדים סביב נושא הבושה.',
    type: 'round_table',
    coverImage:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80',
    startAt: isoIn(24 * 7),
    endAt: isoIn(24 * 7 + 2),
    location: 'זום',
    isOnline: true,
    joinUrl: 'https://zoom.us/j/example',
    domains: ['אשמה, בושה וביקורת עצמית', 'ויסות רגשי'],
    rsvpCount: 42,
    recordingRecordId: undefined,
    ...overrides,
  };

  return Event.from(plainEvent);
}

/**
 * create a list of mock Events, covering the different event types
 * (round table, webinar, local meetup, big conference) as seen in the
 * events page prototype.
 */
export function mockEvents(): Event[] {
  return [
    mockEvent(),
    mockEvent({
      id: uuidv4(),
      slug: 'webinar-sleep',
      title: 'וובינר: שינה וטראומה',
      description: 'הרצאה מקצועית על הקשר בין פוסט-טראומה להפרעות שינה + שאלות.',
      type: 'webinar',
      coverImage:
        'https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&w=900&q=80',
      startAt: isoIn(24 * 21),
      endAt: isoIn(24 * 21 + 1.5),
      location: 'זום',
      isOnline: true,
      joinUrl: 'https://zoom.us/j/example-webinar',
      domains: ['שינה', 'חרדה'],
      rsvpCount: 128,
    }),
    mockEvent({
      id: uuidv4(),
      slug: 'local-tlv',
      title: 'מפגש קהילה — תל אביב',
      description: 'מפגש פנים אל פנים לחברי הקהילה באזור המרכז, באווירה רגועה.',
      type: 'local',
      coverImage:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
      startAt: isoIn(24 * 35),
      endAt: isoIn(24 * 35 + 3),
      location: 'תל אביב',
      isOnline: false,
      joinUrl: undefined,
      domains: ['בדידות וחיבור חברתי'],
      rsvpCount: 19,
    }),
    mockEvent({
      id: uuidv4(),
      slug: 'big-conference',
      title: 'כנס הלם קלאב השנתי',
      description: 'יום שלם של הרצאות, סדנאות ומפגשים — הקהילה נפגשת.',
      type: 'big',
      coverImage:
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
      startAt: isoIn(-24 * 60),
      endAt: isoIn(-24 * 60 + 8),
      location: 'מרכז הכנסים, תל אביב',
      isOnline: false,
      joinUrl: undefined,
      domains: ['בדידות וחיבור חברתי', 'הכרה'],
      rsvpCount: 340,
      recordingRecordId: 'life-after-panel',
    }),
  ];
}
