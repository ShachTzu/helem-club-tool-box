/**
 * the number of days a draft may wait in the queue before it is flagged as
 * overdue in the review queue.
 */
export const OVERDUE_DAYS = 7;

/**
 * how long a draft has been waiting for review, expressed as whole days.
 */
export function waitingDays(submittedAt: string | undefined, now: Date = new Date()): number {
  if (!submittedAt) return 0;
  const submitted = new Date(submittedAt).getTime();
  if (Number.isNaN(submitted)) return 0;
  const diff = now.getTime() - submitted;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/**
 * a Hebrew label describing how long a draft has been waiting for review.
 */
export function waitingLabel(submittedAt: string | undefined, now: Date = new Date()): string {
  const days = waitingDays(submittedAt, now);
  if (days === 0) return 'ממתין מהיום';
  if (days === 1) return 'ממתין יום אחד';
  if (days === 2) return 'ממתין יומיים';
  return `ממתין ${days} ימים`;
}

/**
 * whether a draft has been waiting longer than the overdue threshold.
 */
export function isOverdue(submittedAt: string | undefined, now: Date = new Date()): boolean {
  return waitingDays(submittedAt, now) > OVERDUE_DAYS;
}
