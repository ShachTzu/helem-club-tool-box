/**
 * Mock data for the full Helam Club ecosystem prototype —
 * knowledge base, blog, events and gallery. Domains reuse the marketplace TAGS.
 */

const img = (seed: string, w = 900) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&q=80`;

/** Knowledge-base labels (the "projects" from the sitemap). */
export type KbLabel = {
  slug: string;
  name: string;
  description: string;
  cover: string;
  recordCount: number;
  icon: string;
};

export const LABELS: KbLabel[] = [
  {
    slug: 'first-aid',
    name: 'עזרה ראשונה',
    description: 'כלים מיידיים לרגעי הצפה, חרדה ומשבר — זמינים בכל רגע.',
    cover: img('photo-1527137342181-19aab11a8ee8'),
    recordCount: 12,
    icon: '🚑',
  },
  {
    slug: 'after',
    name: 'אפטר',
    description: 'סדרת שיחות על החיים שאחרי — התמודדות, צמיחה והחלמה.',
    cover: img('photo-1499209974431-9dddcece7f88'),
    recordCount: 18,
    icon: '🌅',
  },
  {
    slug: 'recognition',
    name: 'הכרה',
    description: 'הבנה והכרה של תסמיני פוסט-טראומה — ידע מקצועי בגובה העיניים.',
    cover: img('photo-1454165804606-c3d57bc86b40'),
    recordCount: 9,
    icon: '🧭',
  },
  {
    slug: 'talking-therapy',
    name: 'מדברים טיפול',
    description: 'סדרה על עולם הטיפול — גישות, כלים ומה שכדאי לדעת לפני שמתחילים.',
    cover: img('photo-1573497019940-1c28c88b4f3e'),
    recordCount: 15,
    icon: '💬',
  },
  {
    slug: 'adequate-response',
    name: 'מענה הולם',
    description: 'מיצוי זכויות, מול המערכת, ומענה מותאם למתמודדים ובני משפחה.',
    cover: img('photo-1521791136064-7986c2920216'),
    recordCount: 11,
    icon: '🛡️',
  },
];

/** A media record inside a knowledge-base label. */
export type KbRecord = {
  slug: string;
  labelSlug: string;
  title: string;
  description: string;
  mediaType: 'video' | 'audio';
  thumbnail: string;
  duration: string;
  domains: string[];
  views: number;
};

export const RECORDS: KbRecord[] = [
  {
    slug: 'grounding-flashbacks',
    labelSlug: 'first-aid',
    title: 'קרקוע ברגע של פלאשבק',
    description: 'תרגיל מודרך קצר להחזרת תחושת הביטחון בזמן הצפה או פלאשבק.',
    mediaType: 'video',
    thumbnail: img('photo-1476611317561-60117649dd94'),
    duration: '8:24',
    domains: ['טריגרים', 'חרדה', 'ויסות רגשי'],
    views: 3240,
  },
  {
    slug: 'panic-breathing',
    labelSlug: 'first-aid',
    title: 'נשימה בזמן התקף חרדה',
    description: 'הקלטה קולית שמלווה אותך צעד-צעד דרך התקף חרדה.',
    mediaType: 'audio',
    thumbnail: img('photo-1506126613408-eca07ce68773'),
    duration: '11:02',
    domains: ['חרדה', 'מיינדפולנס ונשימות'],
    views: 2115,
  },
  {
    slug: 'life-after-panel',
    labelSlug: 'after',
    title: 'החיים שאחרי — שולחן עגול',
    description: 'שיחה כנה של ארבעה מתמודדים על השגרה, הזוגיות והתקווה שאחרי.',
    mediaType: 'video',
    thumbnail: img('photo-1543269865-cbf427effbad'),
    duration: '52:10',
    domains: ['משפחה, זוגיות ויחסים', 'דיכאון ותחושת תקיעות'],
    views: 1870,
  },
  {
    slug: 'understanding-ptsd',
    labelSlug: 'recognition',
    title: 'מה זה בעצם פוסט-טראומה?',
    description: 'הסבר מקצועי ונגיש על מנגנוני הטראומה בגוף ובנפש.',
    mediaType: 'video',
    thumbnail: img('photo-1454165804606-c3d57bc86b40'),
    duration: '19:47',
    domains: ['הכרה' as string, 'ויסות רגשי'].filter(Boolean),
    views: 4520,
  },
  {
    slug: 'choosing-therapy',
    labelSlug: 'talking-therapy',
    title: 'איך בוחרים טיפול שמתאים לי?',
    description: 'סקירה של הגישות המרכזיות ושאלות שכדאי לשאול מטפל.',
    mediaType: 'audio',
    thumbnail: img('photo-1573497019940-1c28c88b4f3e'),
    duration: '27:33',
    domains: ['תרופות ופסיכיאטריה', 'דיכאון ותחושת תקיעות'],
    views: 1290,
  },
  {
    slug: 'rights-guide',
    labelSlug: 'adequate-response',
    title: 'מדריך מיצוי זכויות למתמודדים',
    description: 'כל מה שצריך לדעת על הזכויות שלך מול הרשויות והביטוח.',
    mediaType: 'video',
    thumbnail: img('photo-1521791136064-7986c2920216'),
    duration: '34:18',
    domains: ['מיצוי זכויות', 'עבודה וקריירה'],
    views: 980,
  },
];

/** A blog post. */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  date: string;
  domains: string[];
  membersOnly: boolean;
  readTime: string;
};

export const POSTS: Post[] = [
  {
    slug: 'shame-and-guilt',
    title: 'הבושה שאף אחד לא מדבר עליה',
    excerpt: 'על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.',
    cover: img('photo-1499209974431-9dddcece7f88'),
    author: 'ד״ר מיכל ברק',
    date: '12 במאי 2026',
    domains: ['אשמה, בושה וביקורת עצמית', 'ויסות רגשי'],
    membersOnly: false,
    readTime: '6 דק׳',
  },
  {
    slug: 'couples-after-trauma',
    title: 'זוגיות בצל הפוסט-טראומה',
    excerpt: 'שיתוף אישי על מערכת יחסים שמחזיקה שניים — כשאחד המתמודד.',
    cover: img('photo-1522202176988-66273c2fd55f'),
    author: 'אנונימי',
    date: '3 במאי 2026',
    domains: ['משפחה, זוגיות ויחסים', 'בדידות וחיבור חברתי'],
    membersOnly: true,
    readTime: '9 דק׳',
  },
  {
    slug: 'triggers-toolkit',
    title: '5 כלים שעוזרים לי עם טריגרים',
    excerpt: 'רשימה פרקטית של כלים קטנים שאני משתמש בהם ברגעים של הצפה.',
    cover: img('photo-1476611317561-60117649dd94'),
    author: 'רון אבני',
    date: '28 באפריל 2026',
    domains: ['טריגרים', 'מיינדפולנס ונשימות', 'חרדה'],
    membersOnly: false,
    readTime: '4 דק׳',
  },
  {
    slug: 'sleep-story',
    title: 'הלילות הארוכים — ומה שעזר לי לישון',
    excerpt: 'על נדודי שינה אחרי טראומה, וסיפור אישי על הדרך חזרה למנוחה.',
    cover: img('photo-1520206183501-b80df61043c2'),
    author: 'תמר גל',
    date: '19 באפריל 2026',
    domains: ['שינה', 'חרדה'],
    membersOnly: false,
    readTime: '7 דק׳',
  },
];

/** A community event. */
export type Event = {
  slug: string;
  title: string;
  description: string;
  type: string;
  cover: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  domains: string[];
  past: boolean;
};

export const EVENTS: Event[] = [
  {
    slug: 'round-table-shame',
    title: 'שולחן עגול: בושה ואשמה',
    description: 'מפגש פתוח בהנחיית אנשי מקצוע ומתמודדים סביב נושא הבושה.',
    type: 'שולחן עגול',
    cover: img('photo-1543269865-cbf427effbad'),
    date: '4 ביוני 2026',
    time: '19:00',
    location: 'זום',
    isOnline: true,
    domains: ['אשמה, בושה וביקורת עצמית', 'ויסות רגשי'],
    past: false,
  },
  {
    slug: 'webinar-sleep',
    title: 'וובינר: שינה וטראומה',
    description: 'הרצאה מקצועית על הקשר בין פוסט-טראומה להפרעות שינה + שאלות.',
    type: 'וובינר',
    cover: img('photo-1520206183501-b80df61043c2'),
    date: '18 ביוני 2026',
    time: '20:30',
    location: 'זום',
    isOnline: true,
    domains: ['שינה', 'חרדה'],
    past: false,
  },
  {
    slug: 'local-tlv',
    title: 'מפגש קהילה — תל אביב',
    description: 'מפגש פנים אל פנים לחברי הקהילה באזור המרכז, באווירה רגועה.',
    type: 'יוזמה מקומית',
    cover: img('photo-1529156069898-49953e39b3ac'),
    date: '9 ביולי 2026',
    time: '18:00',
    location: 'תל אביב',
    isOnline: false,
    domains: ['בדידות וחיבור חברתי'],
    past: false,
  },
  {
    slug: 'big-conference',
    title: 'כנס הלם קלאב השנתי',
    description: 'יום שלם של הרצאות, סדנאות ומפגשים — הקהילה נפגשת.',
    type: 'אירוע גדול',
    cover: img('photo-1505373877841-8d25f7d46678'),
    date: '2 במרץ 2026',
    time: '09:00',
    location: 'מרכז הכנסים, תל אביב',
    isOnline: false,
    domains: ['בדידות וחיבור חברתי', 'הכרה'],
    past: true,
  },
];

/** A PTSDART gallery item. */
export type GalleryItem = {
  slug: string;
  title: string;
  artist: string;
  mediaType: 'image' | 'video';
  url: string;
  domains: string[];
};

export const GALLERY: GalleryItem[] = [
  { slug: 'g1', title: 'שקט אחרי הסערה', artist: 'נועה ל.', mediaType: 'image', url: img('photo-1502082553048-f009c37129b9'), domains: ['ויסות רגשי'] },
  { slug: 'g2', title: 'אור בקצה', artist: 'אנונימי', mediaType: 'image', url: img('photo-1500534623283-312aade485b7'), domains: ['דיכאון ותחושת תקיעות'] },
  { slug: 'g3', title: 'נשימה', artist: 'דנה כ.', mediaType: 'image', url: img('photo-1444703686981-a3abbc4d4fe3'), domains: ['מיינדפולנס ונשימות', 'חרדה'] },
  { slug: 'g4', title: 'מעגל', artist: 'רון א.', mediaType: 'image', url: img('photo-1518495973542-4542c06a5843'), domains: ['בדידות וחיבור חברתי'] },
  { slug: 'g5', title: 'גלים', artist: 'מ. שרון', mediaType: 'image', url: img('photo-1505142468610-359e7d316be0'), domains: ['שינה', 'ויסות רגשי'] },
  { slug: 'g6', title: 'שורשים', artist: 'אנונימי', mediaType: 'image', url: img('photo-1476611317561-60117649dd94'), domains: ['טריגרים'] },
  { slug: 'g7', title: 'בוקר חדש', artist: 'ליאת ב.', mediaType: 'image', url: img('photo-1499209974431-9dddcece7f88'), domains: ['אשמה, בושה וביקורת עצמית'] },
  { slug: 'g8', title: 'יחד', artist: 'עידו ש.', mediaType: 'image', url: img('photo-1543269865-cbf427effbad'), domains: ['משפחה, זוגיות ויחסים'] },
];
