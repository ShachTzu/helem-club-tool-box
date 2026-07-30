const HEBREW_MONTHS = [
  `בינואר`,
  `בפברואר`,
  `במרץ`,
  `באפריל`,
  `במאי`,
  `ביוני`,
  `ביולי`,
  `באוגוסט`,
  `בספטמבר`,
  `באוקטובר`,
  `בנובמבר`,
  `בדצמבר`,
];

/**
 * formats an ISO date string as a Hebrew publish date label, for example
 * "12 במאי 2026". returns an empty string when the date is missing or
 * invalid.
 */
export function formatPostDate(isoDate?: string): string {
  if (!isoDate) return ``;

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return ``;

  const day = date.getDate();
  const month = HEBREW_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
