import type { UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';
import type { TaggedContent } from '@helemclub/knowledge-domains.hooks.use-domain-content';

/**
 * the shape of a single mocked domain, derived from the useDomains hook mock data type.
 */
export type LobbyMockDomain = NonNullable<UseDomainsOptions['mockData']>[number];

/**
 * the 14 coping domains used across the Helem Club ecosystem, with sample
 * tagged-content counts, for use in compositions and tests.
 */
export const mockLobbyDomains: LobbyMockDomain[] = [
  {
    id: `anxiety`,
    slug: `anxiety`,
    name: `חרדה`,
    description: `כלים מיידיים ומתמשכים להתמודדות עם חרדה והתקפי פאניקה.`,
    icon: `😰`,
    count: 5,
  },
  {
    id: `emotional-regulation`,
    slug: `emotional-regulation`,
    name: `ויסות רגשי`,
    description: `כלים לזיהוי, ויסות והבנת רגשות עזים.`,
    icon: `🌊`,
    count: 4,
  },
  {
    id: `sleep`,
    slug: `sleep`,
    name: `שינה`,
    description: `נדודי שינה, סיוטים וכלים להירדמות רגועה.`,
    icon: `🌙`,
    count: 4,
  },
  {
    id: `triggers`,
    slug: `triggers`,
    name: `טריגרים`,
    description: `זיהוי טריגרים וכלים מיידיים להתמודדות עם הצפה ופלאשבקים.`,
    icon: `⚡`,
    count: 4,
  },
  {
    id: `depression-stuckness`,
    slug: `depression-stuckness`,
    name: `דיכאון ותחושת תקיעות`,
    description: `התמודדות עם דיכאון, חוסר מוטיבציה ותחושת תקיעות.`,
    icon: `🌧️`,
    count: 3,
  },
  {
    id: `loneliness-connection`,
    slug: `loneliness-connection`,
    name: `בדידות וחיבור חברתי`,
    description: `התמודדות עם בדידות ובניית חיבור וקהילה תומכת.`,
    icon: `🤝`,
    count: 3,
  },
  {
    id: `family-relationships`,
    slug: `family-relationships`,
    name: `משפחה, זוגיות ויחסים`,
    description: `זוגיות, הורות ומערכות יחסים בצל התמודדות עם פוסט-טראומה.`,
    icon: `👨‍👩‍👧`,
    count: 3,
  },
  {
    id: `work-career`,
    slug: `work-career`,
    name: `עבודה וקריירה`,
    description: `התמודדות עם אתגרי תעסוקה, חזרה לעבודה ובניית קריירה.`,
    icon: `💼`,
    count: 3,
  },
  {
    id: `mindfulness-breathing`,
    slug: `mindfulness-breathing`,
    name: `מיינדפולנס ונשימות`,
    description: `תרגילי נשימה, מדיטציה ומיינדפולנס להרגעת הגוף והנפש.`,
    icon: `🧘`,
    count: 5,
  },
  {
    id: `guilt-shame`,
    slug: `guilt-shame`,
    name: `אשמה, בושה וביקורת עצמית`,
    description: `עבודה על תחושות אשמה, בושה וקול פנימי ביקורתי.`,
    icon: `😔`,
    count: 2,
  },
  {
    id: `physical-pain`,
    slug: `physical-pain`,
    name: `כאב גופני`,
    description: `הקשר בין טראומה נפשית לכאב גופני, וכלים להקלה.`,
    icon: `🩹`,
    count: 2,
  },
  {
    id: `studies-academia`,
    slug: `studies-academia`,
    name: `לימודים ואקדמיה`,
    description: `כלים והתמודדות עם למידה, מבחנים ומסגרות אקדמיות.`,
    icon: `🎓`,
    count: 2,
  },
  {
    id: `rights`,
    slug: `rights`,
    name: `מיצוי זכויות`,
    description: `מידע ומדריכים למיצוי זכויות מול הרשויות והמערכת.`,
    icon: `🛡️`,
    count: 1,
  },
  {
    id: `medication-psychiatry`,
    slug: `medication-psychiatry`,
    name: `תרופות ופסיכיאטריה`,
    description: `מידע על טיפול תרופתי, פסיכיאטריה ומה שכדאי לדעת.`,
    icon: `💊`,
    count: 1,
  },
];

/**
 * a cross-sliced feed of tagged content for the "אשמה, בושה וביקורת עצמית"
 * (guilt-shame) domain, spanning every content type in the ecosystem.
 */
export const mockLobbyContent: TaggedContent[] = [
  {
    type: `post`,
    id: `shame-and-guilt`,
    title: `הבושה שאף אחד לא מדבר עליה`,
    excerpt: `על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.`,
    url: `/blog/shame-and-guilt`,
    imageUrl: `https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_art_illustration_0_1785193906943.png`,
    domains: [`guilt-shame`, `emotional-regulation`],
  },
  {
    type: `record`,
    id: `self-compassion-practice`,
    title: `תרגול חמלה עצמית מודרך`,
    excerpt: `הקלטה קולית בת 12 דקות לעבודה עדינה עם קול פנימי ביקורתי.`,
    url: `/knowledge/self-compassion-practice`,
    imageUrl: `https://storage.googleapis.com/bit-generated-images/images/image_peaceful_breathing_exercise_sc_0_1785193970736.png`,
    domains: [`guilt-shame`, `mindfulness-breathing`],
  },
  {
    type: `event`,
    id: `round-table-shame`,
    title: `שולחן עגול: בושה ואשמה`,
    excerpt: `מפגש פתוח בהנחיית אנשי מקצוע ומתמודדים סביב נושא הבושה.`,
    url: `/events/round-table-shame`,
    imageUrl: `https://storage.googleapis.com/bit-generated-images/images/image_warm_supportive_community_gath_0_1785193915155.png`,
    domains: [`guilt-shame`],
  },
  {
    type: `app`,
    id: `app-inner-voice`,
    title: `הקול הפנימי — יומן מחשבות`,
    excerpt: `אפליקציה לזיהוי ותרגום מחשבות ביקורתיות למשפטים תומכים.`,
    url: `/toolbox/app-inner-voice`,
    domains: [`guilt-shame`, `depression-stuckness`],
  },
  {
    type: `gallery`,
    id: `g7`,
    title: `בוקר חדש`,
    excerpt: `יצירה מהגלריה הקהילתית בהשראת תחושת שחרור מהעבר.`,
    url: `/gallery/g7`,
    imageUrl: `https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_art_illustration_0_1785193906943.png`,
    domains: [`guilt-shame`],
  },
];
