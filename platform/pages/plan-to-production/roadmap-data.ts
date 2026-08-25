/**
 * The status of a roadmap item on the path from plan to production.
 */
export type ItemStatus = 'done' | 'partial' | 'missing';

/**
 * Priority used to order remaining work.
 */
export type ItemPriority = 'critical' | 'high' | 'medium' | 'low';

/**
 * A single, concrete gap or capability tracked on the road to production.
 */
export type RoadmapItem = {
  /**
   * unique id of the item.
   */
  id: string;

  /**
   * short Hebrew title of the capability or gap.
   */
  title: string;

  /**
   * current implementation status.
   */
  status: ItemStatus;

  /**
   * priority for ordering the remaining work.
   */
  priority: ItemPriority;

  /**
   * plain-language description of what exists today.
   */
  current: string;

  /**
   * concrete recommendation for reaching production.
   */
  recommendation: string;

  /**
   * the scopes / components this item touches.
   */
  areas: string[];
};

/**
 * A themed area grouping several roadmap items.
 */
export type RoadmapSection = {
  /**
   * unique id of the section.
   */
  id: string;

  /**
   * Hebrew title of the section.
   */
  title: string;

  /**
   * emoji icon shown next to the section title.
   */
  icon: string;

  /**
   * one-line summary of the section.
   */
  summary: string;

  /**
   * roadmap items belonging to this section.
   */
  items: RoadmapItem[];
};

/**
 * The full plan-to-production roadmap for the Helam Club platform: a
 * structured, prioritized comparison between the original plan and what is
 * actually built today. Serves as living context for completing development.
 */
export const ROADMAP: RoadmapSection[] = [
  {
    id: 'foundation',
    title: 'תשתית ופלטפורמה',
    icon: '🏗️',
    summary: 'ארכיטקטורת Harmony/IoC, שכבת עיצוב, ורישום פיצ׳רים דרך slots.',
    items: [
      {
        id: 'ioc',
        title: 'ארכיטקטורת IoC — רישום פיצ׳רים דרך slots',
        status: 'done',
        priority: 'high',
        current:
          'כל פיצ׳ר (ארגז כלים, בלוג, אירועים, גלריה, ספריית הידע, תחומים) רושם את עצמו לפלטפורמה דרך registerRoute / registerNavigationItem / registerBackendServer. הפלטפורמה לא תלויה באף פיצ׳ר ספציפי.',
        recommendation: 'אין פעולה נדרשת — זהו הבסיס הנכון. הוספת פיצ׳ר חדש לא תדרוש שינוי בפלטפורמה.',
        areas: ['platform', 'all features'],
      },
      {
        id: 'design-system',
        title: 'שכבת עיצוב (Design System)',
        status: 'done',
        priority: 'medium',
        current:
          '27 קומפוננטות עיצוב עם tokens, theme, ותמיכת RTL. כל הקומפוננטות צורכות משתני CSS מהתמה.',
        recommendation: 'אין פעולה נדרשת. שינוי בתמה יתפשט אוטומטית לכל הקומפוננטות.',
        areas: ['design'],
      },
      {
        id: 'rtl-hebrew',
        title: 'עברית מלאה + RTL',
        status: 'done',
        priority: 'high',
        current: 'כל הממשק בעברית, dir="rtl", lang="he", טקסט מיושר לימין, זרימת פריסה הפוכה.',
        recommendation: 'לבצע מעבר QA סופי על מסכי ה-admin וטפסים ארוכים לוודא יישור מלא.',
        areas: ['design', 'platform'],
      },
    ],
  },
  {
    id: 'auth',
    title: 'הרשמה, התחברות והרשאות',
    icon: '🔐',
    summary: 'מייל, Google, גישה אנונימית, ותפקידי משתמש.',
    items: [
      {
        id: 'anon-access',
        title: 'גישה אנונימית לתוכן',
        status: 'done',
        priority: 'high',
        current: 'כל התוכן נגיש לקריאה ללא התחברות. פעולות engagement והגשות דורשות התחברות.',
        recommendation: 'אין פעולה נדרשת — תואם לתכנון.',
        areas: ['platform', 'engagement'],
      },
      {
        id: 'roles',
        title: 'תפקידי משתמש (member/writer/moderator/admin)',
        status: 'done',
        priority: 'high',
        current:
          'ארבעת התפקידים מוגדרים. ProtectedRoute תומך ב-allowedRoles, לוח ה-admin נעול ל-moderator/admin, ו-resolvers בשרת בודקים תפקיד.',
        recommendation:
          'לחזק: כל registerAdminRoute צריך להצהיר על התפקיד הנדרש שלו במקום להסתמך על כך שה-shell תמיד עוטף. פער קטן אך חשוב לאבטחה.',
        areas: ['platform'],
      },
      {
        id: 'email-otp',
        title: 'הרשמה/התחברות במייל',
        status: 'partial',
        priority: 'critical',
        current:
          'קיים flow של OTP ללא סיסמה — אך הקוד רק מודפס ל-console וכל קוד מתקבל. אין שליחת מייל אמיתית (אין SMTP/nodemailer). זהו bypass לפיתוח בלבד.',
        recommendation:
          'לחבר ספק מייל אמיתי (Resend / SendGrid / SES) לשליחת ה-OTP, לשמור את הקוד עם תפוגה, ולאמת אותו בפועל. חובה לפני פרודקשן.',
        areas: ['platform'],
      },
      {
        id: 'google-oauth',
        title: 'התחברות עם Google',
        status: 'partial',
        priority: 'critical',
        current:
          'signInWithGoogle קיים כ-mutation ו-resolver — אך מזויף: הוא לא מאמת token אמיתי של Google, אלא גוזר מייל דטרמיניסטי. אין Google Client ID ואין אימות token.',
        recommendation:
          'ליצור Google OAuth App, להוסיף Client ID, ולאמת את ה-ID token בצד השרת (google-auth-library). חובה לפני פרודקשן.',
        areas: ['platform'],
      },
    ],
  },
  {
    id: 'domains',
    title: 'תחומי התמודדות (שכבה רוחבית)',
    icon: '🧭',
    summary: 'תיוג רוחבי של כל התכנים, פילטור, ועמודי דומיין לחיצים.',
    items: [
      {
        id: 'domain-tagging',
        title: 'תיוג רוחבי של תכנים',
        status: 'partial',
        priority: 'high',
        current:
          'כל סוגי התוכן נושאים domains[] ופילטור עובד. אך לא אומת מקצה-לקצה שהתיוג עובר דרך שאילתות ה-DB האמיתיות בכל פיצ׳ר.',
        recommendation: 'לבדוק ולוודא round-trip של תיוגים דרך ה-DB בכל פיצ׳ר (כלים, בלוג, אירועים, גלריה, ספריית הידע).',
        areas: ['knowledge-domains', 'all features'],
      },
      {
        id: 'domain-clickable',
        title: 'עמודי דומיין לחיצים (aggregation)',
        status: 'partial',
        priority: 'high',
        current:
          'המסלול /domains/:slug קיים ו-DomainsLobby קורא את ה-slug — אך מסנן נתוני mock ולא שואב מכל הסקופים דרך השרת.',
        recommendation:
          'לחבר את עמוד הדומיין ל-resolver אגרגציה אמיתי שמרכז כלים/כתבות/אירועים/יצירות המתויגים בדומיין.',
        areas: ['knowledge-domains'],
      },
      {
        id: 'wisdom-feed',
        title: 'חוכמת הקהילה (Community Wisdom)',
        status: 'partial',
        priority: 'critical',
        current:
          'buildWisdomFeed מייבא mockApps/mockPosts וכו׳ ישירות מה-entities — לעולם לא שואל את ה-GraphQL gateway. הפיצ׳ר המרכזי של העיצוב רץ על נתונים סטטיים.',
        recommendation:
          'ליצור שכבת אגרגציה בשרת שמרכזת תוכן חוצה-סקופים, ולחבר אליה את ה-feed. זהו ה"דבק" שהופך את המערכת לפלטפורמה אחת.',
        areas: ['knowledge-domains', 'platform'],
      },
    ],
  },
  {
    id: 'content',
    title: 'אזורי תוכן',
    icon: '📚',
    summary: 'ארגז כלים, בלוג, ספריית הידע, אירועים וגלריה.',
    items: [
      {
        id: 'toolbox',
        title: 'ארגז כלים (Toolbox)',
        status: 'done',
        priority: 'high',
        current:
          'קטלוג כלים עם פילטור לפי דומיין, דירוגים, ספירת קליקים, והגשת כלי הדורשת אישור moderator/admin. מחובר לעומק לדומיינים.',
        recommendation: 'לבדוק את זרימת ההגשה והאישור מקצה-לקצה בדפדפן.',
        areas: ['toolbox'],
      },
      {
        id: 'wishlist',
        title: 'רשימת משאלות (Wishlist) בארגז הכלים',
        status: 'missing',
        priority: 'high',
        current:
          'קיים לינק "רשימת משאלות" ל-/toolbox/wishlist בעמוד הקטלוג — אך אין עמוד ואין route רשום. זהו לינק מת.',
        recommendation:
          'לבנות עמוד wishlist: רשימת רעיונות לכלים עם אפשרות הצבעה של חברים רשומים. לרשום route ולהוסיף entity + hook.',
        areas: ['toolbox'],
      },
      {
        id: 'knowledge-base',
        title: 'ספריית הידע (Labels + רשומות)',
        status: 'done',
        priority: 'high',
        current:
          'לובי לכל label, עמוד פנימי לכל רשומה, ספירת צפיות, ומדיה מתארחת חיצונית. תיוג עשיר.',
        recommendation: 'לבדוק את עמודי הלובי והרשומה בדפדפן ולוודא נגינת מדיה חיצונית.',
        areas: ['knowledge-base'],
      },
      {
        id: 'gallery',
        title: 'גלריית PTSDART',
        status: 'partial',
        priority: 'medium',
        current: 'קיים aspect עם gallery-item, עמודי גלריה ותיוג דומיינים. הדיסקברי מבוסס נתוני mock.',
        recommendation: 'לאפיין לעומק את מקור הנתונים וה-discovery UX (כפי שסוכם — "יאופיין בהמשך"), ולחבר לנתונים אמיתיים.',
        areas: ['gallery'],
      },
      {
        id: 'events',
        title: 'אירועים',
        status: 'done',
        priority: 'medium',
        current: 'אירועים, RSVP, תצוגות קרובים/עבר, והקלטות. עמודי listing ו-detail.',
        recommendation: 'לבדוק זרימת RSVP והרשמה בדפדפן.',
        areas: ['events'],
      },
      {
        id: 'blog',
        title: 'בלוג',
        status: 'partial',
        priority: 'medium',
        current:
          'כתבות, מחברים, סטטיסטיקות, flow עריכה והגשה, שער members-only. מודל התוכן נבנה מהבנה כללית.',
        recommendation: 'לנתח את מסמך האפיון המלא (Blog Spec PDF) ולוודא שכל דרישות ה-workflow והתגובות ממופות למודל.',
        areas: ['blog'],
      },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement וניהול',
    icon: '💬',
    summary: 'תגובות, ריאקציות, שמירות, מודרציה וממשקי CRUD.',
    items: [
      {
        id: 'engagement-cross',
        title: 'Engagement רוחבי',
        status: 'done',
        priority: 'high',
        current:
          'EngagementBar מחובר בכל חמשת עמודי התוכן. תגובות/ריאקציות/שמירות מתחברות לכל אובייקט אב.',
        recommendation: 'לבדוק שרשור תגובות והצבעות בדפדפן על תוכן אמיתי.',
        areas: ['engagement', 'all features'],
      },
      {
        id: 'crud',
        title: 'ממשקי CRUD מלאים',
        status: 'partial',
        priority: 'high',
        current:
          'לכל פיצ׳ר יש mutations (create/update/delete) ו-hooks, ועמודי admin קוראים להם. אך לא אומת שכל resolver שומר נכון ל-MongoDB מקצה-לקצה.',
        recommendation: 'לבדוק כל זרימת CRUD בדפדפן (יצירה/עריכה/מחיקה) ולוודא persistence אמיתי בכל פיצ׳ר.',
        areas: ['all features'],
      },
      {
        id: 'global-search',
        title: 'חיפוש גלובלי',
        status: 'partial',
        priority: 'high',
        current:
          'ה-hook use-search יורה שאילתת GraphQL בשם search — אך אין resolver כזה בשום node runtime. החיפוש יחזיר ריק ב-runtime.',
        recommendation:
          'לממש resolver אגרגציה ל-search שמפזר חיפוש על כל הסקופים ומאנדקס תוכן. משותף עם שכבת האגרגציה של חוכמת הקהילה.',
        areas: ['platform', 'all features'],
      },
      {
        id: 'moderation',
        title: 'צנרת מודרציה',
        status: 'partial',
        priority: 'medium',
        current: 'קיים moderation-queue והגשות עם אישור, אך יש לחבר את הטריגרים של דיווח/סימון לתור.',
        recommendation: 'לחבר את פעולות הדיווח (report) בממשק לתור המודרציה ולזרימת האישור.',
        areas: ['engagement'],
      },
    ],
  },
  {
    id: 'ui-fidelity',
    title: 'נאמנות דפים לפרוטוטייפ (UI)',
    icon: '🎨',
    summary: 'השוואה חזותית עמוד-מול-עמוד בין הפרוטוטייפ לפלטפורמה. כל פערי הקיפולים ובאגי הרינדור טופלו — דף הבית והכרטיסים תואמים לפרוטוטייפ.',
    items: [
      {
        id: 'home-folds',
        title: 'דף הבית — קיפולים חסרים (Home)',
        status: 'done',
        priority: 'critical',
        current:
          'דף הבית מרכיב עכשיו את כל הקיפולים של הפרוטוטייפ דרך slot חדש (HomeSection) בפלטפורמה: Hero + סקירת אקוסיסטם, ואז "חוכמת הקהילה" (compact), תצוגה מקדימה של ספריית הידע, "מהבלוג" ו"אירועים קרובים" — כל אחת עם קישור "לכל…". כל פיצ׳ר רושם את התצוגה שלו דרך registerHomeSection, כך שהפלטפורמה לא מייבאת סקופי פיצ׳רים (IoC).',
        recommendation:
          'אין פעולה נדרשת. הוספת תצוגה מקדימה חדשה לדף הבית = registerHomeSection מהפיצ׳ר בלבד.',
        areas: ['platform', 'knowledge-domains', 'blog', 'events', 'knowledge-base'],
      },
      {
        id: 'home-formula-logic',
        title: 'דף הבית — לוגיקת "פסיבי+אקטיבי" ישנה',
        status: 'done',
        priority: 'high',
        current:
          'בלוק הפורמולה "פסיבי + אקטיבי = שיקום" הוסר מ-EcosystemOverview, והדגש עבר ל"חוכמת הקהילה" כמאחד הרוחבי — תואם לפרוטוטייפ.',
        recommendation: 'אין פעולה נדרשת.',
        areas: ['platform'],
      },
      {
        id: 'ecosystem-cards-layout',
        title: 'כרטיסי אקוסיסטם — פריסה שבורה',
        status: 'done',
        priority: 'high',
        current:
          'תוקן ה-CSS של pillarCard/grid (box-sizing, overflow). הכרטיסים מיושרים ונקיים, ללא חפיפת טקסט.',
        recommendation: 'אין פעולה נדרשת.',
        areas: ['platform'],
      },
      {
        id: 'knowledge-cards-overlap',
        title: 'ספריית הידע — כרטיסים חופפים + תמונות חסרות',
        status: 'done',
        priority: 'high',
        current:
          'שני באגים תוקנו מהשורש בשכבת העיצוב: (1) קומפוננטת Link קיבלה prop "block" לעטיפת כרטיס מלא — פותר את החפיפה (ה-span הפנימי היה inline-block וגלש). (2) קומפוננטת Image נתקעה ב-opacity:0 כי אירוע ה-load קרה ב-SSR לפני ש-React חיבר onLoad — נוסף בדיקת img.complete ב-ref. התמונות נטענות והכרטיסים לא חופפים.',
        recommendation: 'אין פעולה נדרשת. התיקון בשורש (Link + Image) חל על כל הכרטיסים במערכת.',
        areas: ['knowledge-base', 'design'],
      },
      {
        id: 'blog-card-images',
        title: 'בלוג — תמונות שער חסרות בכרטיסים',
        status: 'done',
        priority: 'medium',
        current:
          'תמונות השער בכרטיסי הבלוג נטענות עכשיו (תוקן בשורש דרך Image + Link block). הכרטיסים נפרשים נקי זה לצד זה. מספר הכתבות ב-seed הוא עניין נתונים ולא רינדור.',
        recommendation: 'אופציונלי: להרחיב את ה-seed ליותר כתבות כדי להתאים לצפיפות הפרוטוטייפ.',
        areas: ['blog', 'design'],
      },
      {
        id: 'events-card-images',
        title: 'אירועים — תמונות חסרות בכרטיסים',
        status: 'done',
        priority: 'medium',
        current:
          'תמונות האירועים בכרטיסים נטענות עכשיו (תוקן בשורש דרך Image). הטאבים, הפילטרים והמטא-דאטה עובדים, והפריסה נקייה.',
        recommendation: 'אין פעולה נדרשת.',
        areas: ['events', 'design'],
      },
      {
        id: 'pages-parity-ok',
        title: 'עמודים תואמים (Toolbox / Gallery / Wisdom / Domains)',
        status: 'done',
        priority: 'low',
        current:
          'ארגז הכלים, גלריית PTSDART, חוכמת הקהילה ותחומי ההתמודדות תואמים לפרוטוטייפ ואף עשירים יותר (פילטרים עם ספירה, חיפוש, פילטרי מדיה). התמונות נטענות בהם כראוי.',
        recommendation: 'אין פעולה נדרשת — לשמר כבסיס להשוואת שאר העמודים.',
        areas: ['toolbox', 'gallery', 'knowledge-domains'],
      },
    ],
  },
  {
    id: 'infra',
    title: 'תשתית ייצור',
    icon: '🚀',
    summary: 'אחסון קבצים, PWA/מובייל, ואיכות.',
    items: [
      {
        id: 'storage',
        title: 'אחסון קבצים (העלאת תמונות)',
        status: 'missing',
        priority: 'critical',
        current:
          'כל התמונות הן URLs (קישורי cloudinary ב-mock). אין נתיב העלאה כלל — אין multer/R2/S3. משתמשים יכולים רק להדביק URL, לא להעלות קובץ.',
        recommendation:
          'להוסיף אחסון אובייקטים — מומלץ Cloudflare R2 (זול, תואם-S3, ללא עלות egress). נדרש לגלריה (יצירות PTSDART), שערי בלוג ואייקוני כלים.',
        areas: ['platform', 'gallery', 'blog', 'toolbox'],
      },
      {
        id: 'pwa',
        title: 'PWA + מובייל (רספונסיב חכם)',
        status: 'missing',
        priority: 'high',
        current:
          'קיימת קומפוננטת install-prompt אך היא לא מופעלת. אין manifest.json, אין service worker, אין meta tags. תמיכת המובייל היא רספונסיב CSS בלבד.',
        recommendation:
          'להוסיף manifest.json, service worker (offline + caching), meta tags, ולהפעיל את install-prompt. לוודא חוויה native-like במובייל.',
        areas: ['platform'],
      },
      {
        id: 'testing',
        title: 'בדיקות ותיעוד',
        status: 'partial',
        priority: 'low',
        current: 'קיימים specs בסיסיים ו-docs לכל קומפוננטה, אך רבים הם boilerplate.',
        recommendation: 'להחליף specs שלדיים בבדיקות מהותיות, במיוחד לזרימות auth, CRUD ואגרגציה.',
        areas: ['all'],
      },
    ],
  },
];

/**
 * Aggregate counts of items by status, computed from the roadmap.
 */
export function roadmapSummary() {
  const all = ROADMAP.flatMap((section) => section.items);
  return {
    total: all.length,
    done: all.filter((i) => i.status === 'done').length,
    partial: all.filter((i) => i.status === 'partial').length,
    missing: all.filter((i) => i.status === 'missing').length,
    critical: all.filter((i) => i.priority === 'critical').length,
  };
}

/**
 * The critical-path items, ordered — the recommended sequence to production.
 */
export const CRITICAL_PATH: { order: number; title: string; why: string }[] = [
  {
    order: 1,
    title: 'אחסון קבצים (R2)',
    why: 'חוסם הגשת תוכן אמיתי בגלריה, בלוג וארגז הכלים. פער היכולת האמיתי הגדול ביותר.',
  },
  {
    order: 2,
    title: 'שכבת אגרגציה חוצה-סקופים',
    why: 'מפעילה גם את חוכמת הקהילה וגם את החיפוש הגלובלי — ה"דבק" שהופך שישה פיצ׳רים לפלטפורמה אחת.',
  },
  {
    order: 3,
    title: 'התחברות אמיתית (מייל + Google)',
    why: 'שני ה-flows כרגע bypass לפיתוח. חובה לאבטחה לפני חשיפה למשתמשים אמיתיים.',
  },
  {
    order: 4,
    title: 'רשימת משאלות + עמודי דומיין לחיצים',
    why: 'פערים מול התכנון שהמשתמש ציין במפורש — כולל ה-wishlist עם הצבעות.',
  },
  {
    order: 5,
    title: 'בדיקת CRUD ומודרציה מקצה-לקצה',
    why: 'הקוד מחובר אך לא אומת persistence. יש לוודא בדפדפן לפני פרודקשן.',
  },
  {
    order: 6,
    title: 'PWA + מובייל native-like',
    why: 'דרישת מוצר מרכזית — manifest, service worker, והפעלת install-prompt.',
  },
];
