/**
 * formats an ISO timestamp into a short, Hebrew relative time label
 * (e.g. "לפני 3 שעות", "אתמול", "לפני רגע").
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return ``;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return `לפני רגע`;
  if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return `אתמול`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;

  return date.toLocaleDateString(`he-IL`, { day: `numeric`, month: `short`, year: `numeric` });
}
