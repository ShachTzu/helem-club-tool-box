import { v4 as uuidv4 } from 'uuid';
import { ApprovalEntry, type PlainApprovalEntry } from './approval-entry.js';

/**
 * create a single mock ApprovalEntry, optionally overriding any of its properties.
 */
export function mockApprovalEntry(overrides: Partial<PlainApprovalEntry> = {}): ApprovalEntry {
  return ApprovalEntry.from({
    id: uuidv4(),
    draftId: uuidv4(),
    action: 'created',
    actorId: uuidv4(),
    actorName: 'ישראל ישראלי',
    actorRole: 'writer',
    createdAt: new Date().toISOString(),
    ...overrides,
  });
}

/**
 * mock a full approval trail for a single draft, going through a realistic
 * editorial lifecycle: created -> submitted -> changes_requested -> submitted -> approved -> published.
 */
export function mockApprovalEntries(): ApprovalEntry[] {
  const draftId = uuidv4();
  const authorId = uuidv4();
  const authorName = 'ישראל ישראלי';
  const moderatorId = uuidv4();
  const moderatorName = 'רות כהן';

  const baseTime = new Date('2024-01-01T08:00:00.000Z').getTime();
  const hoursLater = (hours: number) => new Date(baseTime + hours * 60 * 60 * 1000).toISOString();

  return [
    ApprovalEntry.from({
      id: uuidv4(),
      draftId,
      action: 'created',
      actorId: authorId,
      actorName: authorName,
      actorRole: 'writer',
      toStatus: 'draft',
      versionNumber: 1,
      createdAt: hoursLater(0),
    }),
    ApprovalEntry.from({
      id: uuidv4(),
      draftId,
      action: 'submitted',
      actorId: authorId,
      actorName: authorName,
      actorRole: 'writer',
      fromStatus: 'draft',
      toStatus: 'in_review',
      versionNumber: 1,
      createdAt: hoursLater(1),
    }),
    ApprovalEntry.from({
      id: uuidv4(),
      draftId,
      action: 'changes_requested',
      actorId: moderatorId,
      actorName: moderatorName,
      actorRole: 'moderator',
      note: 'יש לחדד את הפתיחה ולהוסיף מקורות לציטוטים.',
      fromStatus: 'in_review',
      toStatus: 'changes_requested',
      versionNumber: 1,
      createdAt: hoursLater(4),
    }),
    ApprovalEntry.from({
      id: uuidv4(),
      draftId,
      action: 'submitted',
      actorId: authorId,
      actorName: authorName,
      actorRole: 'writer',
      fromStatus: 'changes_requested',
      toStatus: 'in_review',
      versionNumber: 2,
      createdAt: hoursLater(20),
    }),
    ApprovalEntry.from({
      id: uuidv4(),
      draftId,
      action: 'approved',
      actorId: moderatorId,
      actorName: moderatorName,
      actorRole: 'moderator',
      note: 'תוקן כנדרש, מוכן לפרסום.',
      fromStatus: 'in_review',
      toStatus: 'approved',
      versionNumber: 2,
      createdAt: hoursLater(22),
    }),
    ApprovalEntry.from({
      id: uuidv4(),
      draftId,
      action: 'published',
      actorId: moderatorId,
      actorName: moderatorName,
      actorRole: 'moderator',
      fromStatus: 'approved',
      toStatus: 'published',
      versionNumber: 2,
      createdAt: hoursLater(23),
    }),
  ];
}
