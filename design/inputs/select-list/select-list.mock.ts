import type { SelectListOption } from './select-list-option-type.js';

/**
 * default domain options, mirroring the 14 coping domains
 * used across the Helam Club ecosystem for tagging and filtering.
 */
export const DEFAULT_SELECT_OPTIONS: SelectListOption[] = [
  { value: `work-career`, label: `עבודה וקריירה` },
  { value: `studies-academia`, label: `לימודים ואקדמיה` },
  { value: `triggers`, label: `טריגרים` },
  { value: `rights`, label: `מיצוי זכויות` },
  { value: `physical-pain`, label: `כאב גופני` },
  { value: `family-relationships`, label: `משפחה, זוגיות ויחסים` },
  { value: `medication-psychiatry`, label: `תרופות ופסיכיאטריה` },
  { value: `loneliness-connection`, label: `בדידות וחיבור חברתי` },
  { value: `sleep`, label: `שינה` },
  { value: `guilt-shame`, label: `אשמה, בושה וביקורת עצמית` },
  { value: `anxiety`, label: `חרדה` },
  { value: `emotional-regulation`, label: `ויסות רגשי` },
  { value: `depression-stuckness`, label: `דיכאון ותחושת תקיעות` },
  { value: `mindfulness-breathing`, label: `מיינדפולנס ונשימות` },
];
