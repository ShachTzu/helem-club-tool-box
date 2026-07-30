/**
 * default mapping of domain ids to their Hebrew display names, used to resolve
 * the domain ids stored on a post into human-readable chips in the home-page
 * blog preview. override via the `domainNames` prop when a live domains source
 * is available.
 */
export const DEFAULT_DOMAIN_NAMES: Record<string, string> = {
  anxiety: `חרדה`,
  'emotional-regulation': `ויסות רגשי`,
  sleep: `שינה`,
  triggers: `טריגרים`,
  'depression-stuckness': `דיכאון ותחושת תקיעות`,
  'loneliness-connection': `בדידות וחיבור חברתי`,
  'family-relationships': `משפחה, זוגיות ויחסים`,
  'work-career': `עבודה וקריירה`,
  'mindfulness-breathing': `מיינדפולנס ונשימות`,
  'guilt-shame': `אשמה, בושה וביקורת עצמית`,
  'physical-pain': `כאב גופני`,
  'studies-academia': `לימודים ואקדמיה`,
  rights: `מיצוי זכויות`,
  'medication-psychiatry': `תרופות ופסיכיאטריה`,
};
