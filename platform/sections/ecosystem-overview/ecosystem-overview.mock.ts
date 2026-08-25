import { EcosystemPillar } from './ecosystem-pillar-type.js';

/**
 * default mock data for the ecosystem pillars, matching the Helam Club
 * marketplace prototype's ecosystem landing page.
 */
export const DEFAULT_PILLARS: EcosystemPillar[] = [
  {
    slug: `knowledge`,
    icon: `📚`,
    title: `ספריית הידע`,
    description: `סדרות וידאו, הקלטות והרצאות לפי נושא — ידע מקצועי שנבנה עם אנשי מקצוע.`,
    href: `/knowledge-library`,
  },
  {
    slug: `toolbox`,
    icon: `🧰`,
    title: `ארגז כלים`,
    description: `קטלוג אפליקציות התמודדות מדורג ומסונן, שנבחרו ע"י הקהילה.`,
    href: `/toolbox`,
  },
  {
    slug: `blog`,
    icon: `📝`,
    title: `בלוג`,
    description: `ידע מקצועי ושיתופים אישיים מהקהילה — סיפורים אמיתיים מהשטח.`,
    href: `/blog`,
  },
  {
    slug: `events`,
    icon: `📅`,
    title: `אירועים קהילתיים`,
    description: `שולחנות עגולים, וובינרים ומפגשים — מקוונים ופנים אל פנים.`,
    href: `/events`,
  },
  {
    slug: `gallery`,
    icon: `🎨`,
    title: `גלריית PTSDART`,
    description: `אמנות ויצירה מתוך החוויה האישית של חברי הקהילה.`,
    href: `/gallery`,
  },
];
