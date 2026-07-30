import { Domain, type PlainDomain } from './domain.js';

/**
 * the 14 closed coping domains, used to classify content across the
 * Helem Club ecosystem (apps, posts, knowledge records, events, gallery).
 */
const DOMAIN_SEEDS: PlainDomain[] = [
  {
    id: 'work-career',
    slug: 'work-career',
    name: 'עבודה וקריירה',
    description: 'התמודדות עם אתגרי תעסוקה, חזרה לעבודה ובניית קריירה.',
    icon: '💼',
    count: 3,
  },
  {
    id: 'studies-academia',
    slug: 'studies-academia',
    name: 'לימודים ואקדמיה',
    description: 'כלים והתמודדות עם למידה, מבחנים ומסגרות אקדמיות.',
    icon: '🎓',
    count: 2,
  },
  {
    id: 'triggers',
    slug: 'triggers',
    name: 'טריגרים',
    description: 'זיהוי טריגרים וכלים מיידיים להתמודדות עם הצפה ופלאשבקים.',
    icon: '⚡',
    count: 4,
  },
  {
    id: 'rights',
    slug: 'rights',
    name: 'מיצוי זכויות',
    description: 'מידע ומדריכים למיצוי זכויות מול הרשויות והמערכת.',
    icon: '🛡️',
    count: 1,
  },
  {
    id: 'physical-pain',
    slug: 'physical-pain',
    name: 'כאב גופני',
    description: 'הקשר בין טראומה נפשית לכאב גופני, וכלים להקלה.',
    icon: '🩹',
    count: 2,
  },
  {
    id: 'family-relationships',
    slug: 'family-relationships',
    name: 'משפחה, זוגיות ויחסים',
    description: 'זוגיות, הורות ומערכות יחסים בצל התמודדות עם פוסט-טראומה.',
    icon: '👨‍👩‍👧',
    count: 3,
  },
  {
    id: 'medication-psychiatry',
    slug: 'medication-psychiatry',
    name: 'תרופות ופסיכיאטריה',
    description: 'מידע על טיפול תרופתי, פסיכיאטריה ומה שכדאי לדעת.',
    icon: '💊',
    count: 1,
  },
  {
    id: 'loneliness-connection',
    slug: 'loneliness-connection',
    name: 'בדידות וחיבור חברתי',
    description: 'התמודדות עם בדידות ובניית חיבור וקהילה תומכת.',
    icon: '🤝',
    count: 3,
  },
  {
    id: 'sleep',
    slug: 'sleep',
    name: 'שינה',
    description: 'נדודי שינה, סיוטים וכלים להירדמות רגועה.',
    icon: '🌙',
    count: 4,
  },
  {
    id: 'guilt-shame',
    slug: 'guilt-shame',
    name: 'אשמה, בושה וביקורת עצמית',
    description: 'עבודה על תחושות אשמה, בושה וקול פנימי ביקורתי.',
    icon: '😔',
    count: 2,
  },
  {
    id: 'anxiety',
    slug: 'anxiety',
    name: 'חרדה',
    description: 'כלים מיידיים ומתמשכים להתמודדות עם חרדה והתקפי פאניקה.',
    icon: '😰',
    count: 5,
  },
  {
    id: 'emotional-regulation',
    slug: 'emotional-regulation',
    name: 'ויסות רגשי',
    description: 'כלים לזיהוי, ויסות והבנת רגשות עזים.',
    icon: '🌊',
    count: 4,
  },
  {
    id: 'depression-stuckness',
    slug: 'depression-stuckness',
    name: 'דיכאון ותחושת תקיעות',
    description: 'התמודדות עם דיכאון, חוסר מוטיבציה ותחושת תקיעות.',
    icon: '🌧️',
    count: 3,
  },
  {
    id: 'mindfulness-breathing',
    slug: 'mindfulness-breathing',
    name: 'מיינדפולנס ונשימות',
    description: 'תרגילי נשימה, מדיטציה ומיינדפולנס להרגעת הגוף והנפש.',
    icon: '🧘',
    count: 5,
  },
];

/**
 * returns mocked Domain entities for the 14 coping domains,
 * supporting partial overrides per item (matched by index).
 */
export function mockDomains(overrides: Partial<PlainDomain>[] = []): Domain[] {
  return DOMAIN_SEEDS.map((seed, index) =>
    Domain.from({ ...seed, ...(overrides[index] || {}) })
  );
}

/**
 * returns a single mocked Domain entity, with optional property overrides.
 */
export function mockDomain(overrides: Partial<PlainDomain> = {}): Domain {
  return Domain.from({ ...DOMAIN_SEEDS[0], ...overrides });
}
