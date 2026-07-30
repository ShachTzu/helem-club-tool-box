import type { PlainEvent } from '@helemclub/events.entities.event';
import type { PlainLabel } from '@helemclub/knowledge-base.entities.label';
import type { DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';

const HOUR = 1000 * 60 * 60;

function isoIn(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * HOUR).toISOString();
}

/**
 * mock events covering the different event types (round table, webinar,
 * local meetup, big conference), including one past event awaiting a
 * published recording.
 */
export const MOCK_MANAGE_EVENTS: PlainEvent[] = [
  {
    id: `evt-1`,
    slug: `round-table-shame`,
    title: `שולחן עגול: בושה ואשמה`,
    description: `מפגש פתוח בהנחיית אנשי מקצוע ומתמודדים סביב נושא הבושה.`,
    type: `round_table`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calm_illustration_of_a_small_0_1785194495531.png`,
    startAt: isoIn(24 * 7),
    endAt: isoIn(24 * 7 + 2),
    location: `זום`,
    isOnline: true,
    joinUrl: `https://zoom.us/j/example`,
    domains: [`guilt-shame`, `emotional-regulation`],
    rsvpCount: 42,
    recordingRecordId: undefined,
  },
  {
    id: `evt-2`,
    slug: `webinar-sleep`,
    title: `וובינר: שינה וטראומה`,
    description: `הרצאה מקצועית על הקשר בין פוסט-טראומה להפרעות שינה + שאלות.`,
    type: `webinar`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calm_illustration_representi_0_1785194368896.png`,
    startAt: isoIn(24 * 21),
    endAt: isoIn(24 * 21 + 1.5),
    location: `זום`,
    isOnline: true,
    joinUrl: `https://zoom.us/j/example-webinar`,
    domains: [`sleep`, `anxiety`],
    rsvpCount: 128,
    recordingRecordId: undefined,
  },
  {
    id: `evt-3`,
    slug: `local-tlv`,
    title: `מפגש קהילה — תל אביב`,
    description: `מפגש פנים אל פנים לחברי הקהילה באזור המרכז, באווירה רגועה.`,
    type: `local`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_warm__calm_illustration_of_a_0_1785194376613.png`,
    startAt: isoIn(24 * 35),
    endAt: isoIn(24 * 35 + 3),
    location: `תל אביב`,
    isOnline: false,
    joinUrl: undefined,
    domains: [`loneliness-connection`],
    rsvpCount: 19,
    recordingRecordId: undefined,
  },
  {
    id: `evt-4`,
    slug: `big-conference`,
    title: `כנס הלם קלאב השנתי`,
    description: `יום שלם של הרצאות, סדנאות ומפגשים — הקהילה נפגשת.`,
    type: `big`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calm_illustration_of_a_large_0_1785194369080.png`,
    startAt: isoIn(-24 * 60),
    endAt: isoIn(-24 * 60 + 8),
    location: `מרכז הכנסים, תל אביב`,
    isOnline: false,
    joinUrl: undefined,
    domains: [`loneliness-connection`, `guilt-shame`],
    rsvpCount: 340,
    recordingRecordId: undefined,
  },
  {
    id: `evt-5`,
    slug: `panel-recovery`,
    title: `פאנל: החיים אחרי`,
    description: `שיחה פתוחה עם בוגרי תוכניות שיקום על החיים אחרי ההתמודדות.`,
    type: `round_table`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calm_illustration_of_a_large_0_1785194369080.png`,
    startAt: isoIn(-24 * 20),
    endAt: isoIn(-24 * 20 + 2),
    location: `זום`,
    isOnline: true,
    joinUrl: undefined,
    domains: [`depression-stuckness`],
    rsvpCount: 87,
    recordingRecordId: `panel-recovery-recording`,
  },
];

/**
 * mock knowledge-base labels used when publishing an event recording.
 */
export const MOCK_MANAGE_EVENTS_LABELS = [
  {
    id: `lbl-1`,
    slug: `first-aid`,
    name: `עזרה ראשונה`,
    description: `כלים מיידיים למצבי משבר.`,
    coverImage: undefined,
    recordCount: 12,
  },
  {
    id: `lbl-2`,
    slug: `after`,
    name: `אפטר`,
    description: `תוכן להתמודדות לטווח ארוך.`,
    coverImage: undefined,
    recordCount: 8,
  },
  {
    id: `lbl-3`,
    slug: `recognition`,
    name: `הכרה`,
    description: `הליכי הכרה וזכויות.`,
    coverImage: undefined,
    recordCount: 5,
  },
];

/**
 * mock knowledge domains used by the domain selector within the form.
 */
export const MOCK_MANAGE_EVENTS_DOMAINS = [
  { id: `guilt-shame`, slug: `guilt-shame`, name: `אשמה, בושה וביקורת עצמית`, icon: `😔`, count: 2 },
  { id: `emotional-regulation`, slug: `emotional-regulation`, name: `ויסות רגשי`, icon: `🌊`, count: 4 },
  { id: `sleep`, slug: `sleep`, name: `שינה`, icon: `🌙`, count: 4 },
  { id: `anxiety`, slug: `anxiety`, name: `חרדה`, icon: `😰`, count: 5 },
  { id: `loneliness-connection`, slug: `loneliness-connection`, name: `בדידות וחיבור חברתי`, icon: `🤝`, count: 3 },
  { id: `depression-stuckness`, slug: `depression-stuckness`, name: `דיכאון ותחושת תקיעות`, icon: `🌧️`, count: 3 },
];
