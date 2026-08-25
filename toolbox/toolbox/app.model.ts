import { prop, index } from '@typegoose/typegoose';

/**
 * one append-only entry in an app's moderation history. every decision
 * (approve / reject / request_changes) pushes a new entry rather than
 * overwriting the last one, so the full review trail survives a
 * changes_requested → resubmit → re-review cycle.
 */
export class ModerationHistoryEntry {
  @prop({ required: true, type: String })
  public action: string;

  @prop({ type: String, default: '' })
  public note: string;

  @prop({ required: true, type: String })
  public moderatorId: string;

  @prop({ type: String, default: '' })
  public moderatorName: string;

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;
}

/**
 * a typegoose model backing a coping-app catalog entry in the toolbox.
 * mirrors the PlainApp shape consumed by the toolbox hooks, so every field
 * selected by the GraphQL contract is persisted here.
 */
@index(
  { name: 'text', fullDescription: 'text', subtitle: 'text' },
  { language_override: 'textLang', default_language: 'none' }
)
@index({ slug: 1 }, { unique: true })
export class AppModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public slug: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ type: String, default: '' })
  public subtitle: string;

  @prop({ type: String, default: '' })
  public fullDescription: string;

  @prop({ type: String, default: '' })
  public externalLink: string;

  @prop({ type: String, default: '' })
  public icon: string;

  @prop({ type: () => [String], default: [] })
  public screenshots: string[];

  @prop({ type: String, default: '' })
  public costType: string;

  @prop({ type: () => [String], default: [] })
  public platform: string[];

  @prop({ type: String, default: 'עברית' })
  public language: string;

  @prop({ type: Boolean, default: false })
  public requiresSignup: boolean;

  @prop({ type: () => [String], default: [] })
  public domains: string[];

  @prop({ type: String, default: 'pending' })
  public status: string;

  @prop({ type: Boolean, default: false })
  public isFeatured: boolean;

  @prop({ type: Number, default: 0 })
  public clickCount: number;

  @prop({ type: Number, default: 0 })
  public helpfulYes: number;

  @prop({ type: Number, default: 0 })
  public helpfulNo: number;

  @prop({ type: String, default: '' })
  public developerName: string;

  /**
   * contact email for the submitter. PII — surfaced only to moderators, never
   * mapped into the public app shape.
   */
  @prop({ type: String, default: '' })
  public contactEmail: string;

  /**
   * where the submission originated, e.g. 'hackathon-1'. used to identify and
   * filter a submission cohort.
   */
  @prop({ type: String, default: '' })
  public submissionSource: string;

  @prop({ type: String, default: '' })
  public originatorName: string;

  @prop({ type: Number, default: 0 })
  public avgRating: number;

  @prop({ type: Number, default: 0 })
  public ratingCount: number;

  @prop({ type: () => [Number], default: [0, 0, 0, 0, 0] })
  public ratingHistogram: number[];

  @prop({ type: String, default: '' })
  public submittedBy: string;

  /**
   * the moderator's explanation for a 'rejected' or 'changes_requested'
   * decision. required for those two actions, cleared on approval.
   */
  @prop({ type: String, default: '' })
  public moderatorNote: string;

  /**
   * append-only moderation trail. who decided what, when, and why — never
   * overwritten, so a resubmitted tool keeps its earlier decisions on record.
   */
  @prop({ type: () => [ModerationHistoryEntry], default: [] })
  public moderationHistory: ModerationHistoryEntry[];

  /**
   * when the last decision was applied. also the key a batch reads its own
   * results back by, so it never reports apps another moderator had already
   * decided. the "who" lives in moderationHistory, not here.
   */
  @prop({ type: Date })
  public reviewedAt?: Date;

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;
}

const shot = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=80`;

/**
 * the seed catalog of coping apps, tagged across the 14 closed coping-domains,
 * ported from the Helam Club marketplace prototype. approved apps are shown in
 * the public toolbox; a couple of pending submissions feed the moderation queue.
 */
export const APP_MOCKS = [
  {
    id: 'breathe-calm',
    slug: 'breathe-calm',
    name: 'נשימה רגועה',
    subtitle: 'תרגילי נשימה מודרכים להרגעה מיידית',
    fullDescription:
      'אפליקציה שמלווה אותך בתרגילי נשימה קצרים ברגעים של הצפה. מגוון קצבים, ליווי קולי רגוע, ותזכורות עדינות לאורך היום. מתאימה במיוחד לרגעי חרדה, טריגרים והרגעה לפני שינה.',
    externalLink: 'https://example.com/breathe',
    icon: '🫧',
    screenshots: [
      shot('photo-1506126613408-eca07ce68773'),
      shot('photo-1499209974431-9dddcece7f88'),
      shot('photo-1518495973542-4542c06a5843'),
    ],
    costType: 'חינם לחברי הקהילה',
    platform: ['iOS', 'Android'],
    language: 'עברית',
    requiresSignup: false,
    domains: ['מיינדפולנס ונשימות', 'חרדה', 'שינה'],
    status: 'approved',
    isFeatured: true,
    clickCount: 1240,
    helpfulYes: 312,
    helpfulNo: 28,
    developerName: 'דנה לוי',
    originatorName: 'יוסי כהן',
    avgRating: 4.7,
    ratingCount: 96,
    ratingHistogram: [2, 3, 6, 20, 65],
    submittedBy: 'admin',
    createdAt: new Date('2024-01-05T09:00:00.000Z'),
  },
  {
    id: 'sleep-anchor',
    slug: 'sleep-anchor',
    name: 'עוגן לילה',
    subtitle: 'סיפורי הרדמה ונופי סאונד לשינה עמוקה',
    fullDescription:
      'ספרייה של נופי סאונד וסיפורי הרדמה בעברית, שנבנתה מתוך הצורך של מתמודדים עם הפרעות שינה. טיימר שקיעה, מצב לילה כהה, ואפשרות להורדה לשימוש ללא אינטרנט.',
    externalLink: 'https://example.com/sleep',
    icon: '🌙',
    screenshots: [shot('photo-1520206183501-b80df61043c2'), shot('photo-1444703686981-a3abbc4d4fe3')],
    costType: 'כולל רכישות',
    platform: ['iOS', 'Android', 'Web'],
    language: 'עברית',
    requiresSignup: true,
    domains: ['שינה', 'מיינדפולנס ונשימות', 'חרדה'],
    status: 'approved',
    isFeatured: false,
    clickCount: 870,
    helpfulYes: 190,
    helpfulNo: 41,
    developerName: 'אורי מזרחי',
    originatorName: '',
    avgRating: 4.3,
    ratingCount: 58,
    ratingHistogram: [1, 4, 8, 18, 27],
    submittedBy: 'admin',
    createdAt: new Date('2024-01-12T09:00:00.000Z'),
  },
  {
    id: 'ground-me',
    slug: 'ground-me',
    name: 'קרקוע',
    subtitle: 'כלים להתמודדות עם טריגרים ופלאשבקים',
    fullDescription:
      'ערכת כלי קרקוע (grounding) זמינים בלחיצה אחת ברגע של הצפה או פלאשבק — תרגילי 5-4-3-2-1, אובייקטים מרגיעים, ואנשי קשר לשעת חירום. עוצבה יחד עם מתמודדי פוסט-טראומה.',
    externalLink: 'https://example.com/ground',
    icon: '🪨',
    screenshots: [shot('photo-1476611317561-60117649dd94'), shot('photo-1500534623283-312aade485b7')],
    costType: 'חינם לחברי הקהילה',
    platform: ['iOS', 'Android'],
    language: 'עברית',
    requiresSignup: false,
    domains: ['טריגרים', 'ויסות רגשי', 'חרדה'],
    status: 'approved',
    isFeatured: true,
    clickCount: 1520,
    helpfulYes: 402,
    helpfulNo: 19,
    developerName: 'מיכל ברק',
    originatorName: 'שרה דוד',
    avgRating: 4.9,
    ratingCount: 143,
    ratingHistogram: [1, 1, 4, 15, 122],
    submittedBy: 'admin',
    createdAt: new Date('2024-01-20T09:00:00.000Z'),
  },
  {
    id: 'mood-map',
    slug: 'mood-map',
    name: 'מצב רוח',
    subtitle: 'יומן רגשי פשוט למעקב וויסות',
    fullDescription:
      'יומן רגשי יומי שעוזר לזהות דפוסים, טריגרים והתקדמות. גרפים ברורים, תזכורות עדינות, וייצוא לשיתוף עם מטפל. בלי לחץ, בלי שיפוטיות.',
    externalLink: 'https://example.com/mood',
    icon: '📓',
    screenshots: [shot('photo-1517842645767-c639042777db'), shot('photo-1522202176988-66273c2fd55f')],
    costType: 'חינם לחברי הקהילה',
    platform: ['Web', 'iOS'],
    language: 'עברית',
    requiresSignup: false,
    domains: ['ויסות רגשי', 'דיכאון ותחושת תקיעות', 'אשמה, בושה וביקורת עצמית'],
    status: 'approved',
    isFeatured: false,
    clickCount: 640,
    helpfulYes: 121,
    helpfulNo: 33,
    developerName: 'תמר גל',
    originatorName: '',
    avgRating: 4.1,
    ratingCount: 47,
    ratingHistogram: [2, 3, 9, 15, 18],
    submittedBy: 'admin',
    createdAt: new Date('2024-02-01T09:00:00.000Z'),
  },
  {
    id: 'connect-circle',
    slug: 'connect-circle',
    name: 'מעגל',
    subtitle: 'קבוצות תמיכה קטנות ומוגנות',
    fullDescription:
      'מרחב מוגן למפגשים קבוצתיים קטנים בין מתמודדים ובני משפחה, עם מנחה. נבנה כדי להילחם בבדידות וליצור חיבור אמיתי בקצב שלך.',
    externalLink: 'https://example.com/circle',
    icon: '🤝',
    screenshots: [shot('photo-1529156069898-49953e39b3ac'), shot('photo-1543269865-cbf427effbad')],
    costType: 'חינם לחברי הקהילה',
    platform: ['Web'],
    language: 'עברית',
    requiresSignup: true,
    domains: ['בדידות וחיבור חברתי', 'משפחה, זוגיות ויחסים', 'דיכאון ותחושת תקיעות'],
    status: 'approved',
    isFeatured: false,
    clickCount: 410,
    helpfulYes: 88,
    helpfulNo: 12,
    developerName: 'נועם פרץ',
    originatorName: 'רון אבני',
    avgRating: 4.5,
    ratingCount: 34,
    ratingHistogram: [1, 1, 3, 10, 19],
    submittedBy: 'admin',
    createdAt: new Date('2024-02-10T09:00:00.000Z'),
  },
  {
    id: 'focus-work',
    slug: 'focus-work',
    name: 'מיקוד',
    subtitle: 'ניהול משימות עדין לימים קשים',
    fullDescription:
      'מנהל משימות שמבין שיש ימים קשים. מפרק משימות לצעדים זעירים, חוגג ניצחונות קטנים, ומאפשר לדחות בלי אשמה. תוכנן לחזרה עדינה לעבודה וללימודים.',
    externalLink: 'https://example.com/focus',
    icon: '🎯',
    screenshots: [shot('photo-1484480974693-6ca0a78fb36b'), shot('photo-1499750310107-5fef28a66643')],
    costType: 'כולל רכישות',
    platform: ['iOS', 'Android', 'Web'],
    language: 'עברית',
    requiresSignup: false,
    domains: ['עבודה וקריירה', 'לימודים ואקדמיה', 'ויסות רגשי'],
    status: 'approved',
    isFeatured: false,
    clickCount: 720,
    helpfulYes: 143,
    helpfulNo: 37,
    developerName: 'עידן שמש',
    originatorName: '',
    avgRating: 4.2,
    ratingCount: 51,
    ratingHistogram: [2, 3, 8, 19, 19],
    submittedBy: 'admin',
    createdAt: new Date('2024-02-18T09:00:00.000Z'),
  },
  {
    id: 'rights-navigator',
    slug: 'rights-navigator',
    name: 'מצפן זכויות',
    subtitle: 'ליווי במיצוי זכויות מול ביטוח לאומי וקופות',
    fullDescription:
      'כלי שמפשט את הבירוקרטיה של מיצוי זכויות — מסביר צעד-צעד איך להגיש ועדות, ערעורים ובקשות, עם תזכורות לתאריכים ורשימות מסמכים. הוגש ע"י חברי הקהילה וממתין לאישור.',
    externalLink: 'https://example.com/rights',
    icon: '🧭',
    screenshots: [],
    costType: 'חינם לחברי הקהילה',
    platform: ['Web'],
    language: 'עברית',
    requiresSignup: false,
    domains: ['מיצוי זכויות', 'עבודה וקריירה'],
    status: 'pending',
    isFeatured: false,
    clickCount: 0,
    helpfulYes: 0,
    helpfulNo: 0,
    developerName: 'רות כהן',
    originatorName: '',
    avgRating: 0,
    ratingCount: 0,
    ratingHistogram: [0, 0, 0, 0, 0],
    submittedBy: 'member-1',
    createdAt: new Date('2024-03-02T09:00:00.000Z'),
  },
  {
    id: 'gentle-body',
    slug: 'gentle-body',
    name: 'גוף עדין',
    subtitle: 'תרגילי הקלה לכאב גופני כרוני',
    fullDescription:
      'סדרות תנועה עדינות ומדיטציות גוף שנבנו יחד עם פיזיותרפיסטים, להקלה על כאב כרוני ולחיבור מחודש לגוף. כולל מעקב עצמות והתאמת עצימות. ממתין לאישור צוות המנחים.',
    externalLink: 'https://example.com/gentle-body',
    icon: '🌿',
    screenshots: [],
    costType: 'פרימיום — חלק בתשלום',
    platform: ['iOS', 'Android'],
    language: 'עברית',
    requiresSignup: true,
    domains: ['כאב גופני', 'מיינדפולנס ונשימות', 'תרופות ופסיכיאטריה'],
    status: 'pending',
    isFeatured: false,
    clickCount: 0,
    helpfulYes: 0,
    helpfulNo: 0,
    developerName: 'אלון שביט',
    originatorName: '',
    avgRating: 0,
    ratingCount: 0,
    ratingHistogram: [0, 0, 0, 0, 0],
    submittedBy: 'member-2',
    createdAt: new Date('2024-03-06T09:00:00.000Z'),
  },
];
