import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { mockRevisions } from '@helemclub/editorial.entities.revision';
import { mockApprovalEntries } from '@helemclub/editorial.entities.approval-entry';
import type { VersionHistoryUser } from './version-history-user-type.js';

/**
 * a writer-level mock user, used to preview and test the version history
 * page while signed in with sufficient permissions.
 */
export function mockVersionHistoryUser(overrides: Partial<VersionHistoryUser> = {}): VersionHistoryUser {
  return {
    id: `writer-1`,
    email: `writer@helem.club`,
    displayName: `נועה כותבת`,
    role: `writer`,
    provider: `email`,
    createdAt: new Date(`2024-02-10T08:00:00.000Z`).toISOString(),
    ...overrides,
  };
}

/**
 * a draft with five sequential revisions, used to preview a rich history
 * timeline.
 */
export function mockVersionHistoryDraft() {
  return mockDrafts([{ id: `draft-history-1`, title: `מדריך התחלה לחברי קהילה חדשים`, currentVersion: 5 }])[0];
}

/**
 * five sequential mock revisions of the same draft, ordered from the
 * earliest to the latest.
 */
export function mockFiveRevisions() {
  const base = mockRevisions();
  const draftId = `draft-history-1`;

  return [
    { ...base[0].toObject(), draftId, versionNumber: 1, title: `מדריך התחלה לחברי קהילה חדשים`, changeSummary: `יצירת הטיוטה הראשונית` },
    { ...base[1].toObject(), draftId, versionNumber: 2, title: `מדריך התחלה לחברי קהילה חדשים`, changeSummary: `הוספת פרק על קבוצות תמיכה` },
    { ...base[2].toObject(), draftId, versionNumber: 3, title: `מדריך התחלה לחברי קהילה חדשים`, changeSummary: `תיקונים לפי הערות המנחה` },
    {
      id: `revision-4`,
      draftId,
      versionNumber: 4,
      payload: { title: `מדריך התחלה לחברי קהילה חדשים`, body: `תוכן מעודכן עם דוגמאות נוספות ומידע על ליווי אישי.` },
      domains: [`כללי`, `תמיכה`],
      title: `מדריך התחלה לחברי קהילה חדשים`,
      authorId: `writer-1`,
      authorName: `נועה כותבת`,
      changeSummary: `הרחבת הפרק על ליווי אישי`,
      createdAt: new Date(`2024-05-01T10:00:00.000Z`).toISOString(),
    },
    {
      id: `revision-5`,
      draftId,
      versionNumber: 5,
      payload: {
        title: `מדריך התחלה לחברי קהילה חדשים - מעודכן`,
        body: `תוכן מעודכן עם דוגמאות נוספות, מידע על ליווי אישי, וקישורים לכלים מומלצים.`,
      },
      domains: [`כללי`, `תמיכה`, `כלים`],
      title: `מדריך התחלה לחברי קהילה חדשים - מעודכן`,
      authorId: `writer-1`,
      authorName: `נועה כותבת`,
      changeSummary: `עדכון כותרת והוספת קישורים לכלים`,
      createdAt: new Date(`2024-05-15T12:30:00.000Z`).toISOString(),
    },
  ];
}

/**
 * a single mock revision, used to preview a draft with no meaningful
 * history yet.
 */
export function mockSingleRevision() {
  const base = mockRevisions()[0].toObject();
  return [{ ...base, draftId: `draft-history-single`, versionNumber: 1, changeSummary: `יצירת הטיוטה הראשונית` }];
}

/**
 * mock approval trail entries matching the five-revision mock draft.
 */
export function mockHistoryApprovals() {
  return mockApprovalEntries().map((entry) => ({ ...entry.toObject(), draftId: `draft-history-1` }));
}
