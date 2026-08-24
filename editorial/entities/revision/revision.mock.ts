import { v4 as uuid } from 'uuid';
import { Revision, type PlainRevision } from './revision.js';

/**
 * generates a mock Revision, allowing partial overrides of its properties.
 */
export function mockRevision(overrides: Partial<PlainRevision> = {}): Revision {
  return Revision.from({
    id: uuid(),
    draftId: uuid(),
    versionNumber: 1,
    payload: { title: 'טיוטה ראשונית', body: 'תוכן ראשוני של הטיוטה.' },
    domains: ['general'],
    title: 'מדריך התחלה מהירה',
    authorId: 'user-1',
    authorName: 'דנה כהן',
    changeSummary: 'יצירת הטיוטה הראשונית',
    createdAt: new Date('2024-01-01T09:00:00.000Z').toISOString(),
    ...overrides,
  });
}

/**
 * generates 4 sequential mock revisions of the same draft, demonstrating
 * the immutable, append-only history of a draft's evolution.
 */
export function mockRevisions(): Revision[] {
  const draftId = 'draft-42';

  return [
    mockRevision({
      id: 'revision-1',
      draftId,
      versionNumber: 1,
      payload: { title: 'מדריך התחלה מהירה', body: 'טיוטה ראשונית של המדריך.' },
      domains: ['onboarding'],
      title: 'מדריך התחלה מהירה',
      authorId: 'user-1',
      authorName: 'דנה כהן',
      changeSummary: 'יצירת הטיוטה הראשונית',
      createdAt: new Date('2024-01-01T09:00:00.000Z').toISOString(),
    }),
    mockRevision({
      id: 'revision-2',
      draftId,
      versionNumber: 2,
      payload: {
        title: 'מדריך התחלה מהירה',
        body: 'טיוטה ראשונית של המדריך, עם תיקוני ניסוח.',
      },
      domains: ['onboarding'],
      title: 'מדריך התחלה מהירה',
      authorId: 'user-1',
      authorName: 'דנה כהן',
      changeSummary: 'תיקוני ניסוח בפסקת הפתיחה',
      createdAt: new Date('2024-01-02T10:30:00.000Z').toISOString(),
    }),
    mockRevision({
      id: 'revision-3',
      draftId,
      versionNumber: 3,
      payload: {
        title: 'מדריך התחלה מהירה למשתמשים חדשים',
        body: 'טיוטה מעודכנת עם דוגמאות קוד נוספות.',
      },
      domains: ['onboarding', 'developers'],
      title: 'מדריך התחלה מהירה למשתמשים חדשים',
      authorId: 'user-2',
      authorName: 'יוסי לוי',
      changeSummary: 'עדכון הכותרת והוספת דומיין developers',
      createdAt: new Date('2024-01-03T14:15:00.000Z').toISOString(),
    }),
    mockRevision({
      id: 'revision-4',
      draftId,
      versionNumber: 4,
      payload: {
        title: 'מדריך התחלה מהירה למשתמשים חדשים',
        body: 'טיוטה סופית, כוללת תיקוני שפה אחרונים לפני פרסום.',
      },
      domains: ['onboarding', 'developers'],
      title: 'מדריך התחלה מהירה למשתמשים חדשים',
      authorId: 'user-2',
      authorName: 'יוסי לוי',
      changeSummary: 'תיקוני שפה אחרונים לפני שליחה לאישור',
      createdAt: new Date('2024-01-04T08:45:00.000Z').toISOString(),
    }),
  ];
}
