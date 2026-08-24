import { ApprovalEntry } from './approval-entry.js';
import { mockApprovalEntry, mockApprovalEntries } from './approval-entry.mock.js';

it('has an ApprovalEntry.from() method', () => {
  expect(ApprovalEntry.from).toBeTruthy();
});

it('should create an ApprovalEntry from a plain object', () => {
  const entry = mockApprovalEntry({ action: 'approved' });
  expect(entry).toBeInstanceOf(ApprovalEntry);
  expect(entry.action).toBe('approved');
});

it('should serialize an ApprovalEntry into a plain object with toObject()', () => {
  const entry = mockApprovalEntry({ id: 'entry-1', draftId: 'draft-1' });
  const plain = entry.toObject();

  expect(plain).toEqual({
    id: 'entry-1',
    draftId: 'draft-1',
    action: entry.action,
    actorId: entry.actorId,
    actorName: entry.actorName,
    actorRole: entry.actorRole,
    createdAt: entry.createdAt,
    note: undefined,
    fromStatus: undefined,
    toStatus: undefined,
    versionNumber: undefined,
  });
});

it('should return the id property in toObject()', () => {
  const entry = mockApprovalEntry({ id: 'my-entry-id' });
  expect(entry.toObject().id).toBe('my-entry-id');
});

describe('isDecision', () => {
  it('should be true for approved, rejected and changes_requested actions', () => {
    expect(mockApprovalEntry({ action: 'approved' }).isDecision).toBe(true);
    expect(mockApprovalEntry({ action: 'rejected' }).isDecision).toBe(true);
    expect(mockApprovalEntry({ action: 'changes_requested' }).isDecision).toBe(true);
  });

  it('should be false for non-decision actions', () => {
    expect(mockApprovalEntry({ action: 'created' }).isDecision).toBe(false);
    expect(mockApprovalEntry({ action: 'submitted' }).isDecision).toBe(false);
    expect(mockApprovalEntry({ action: 'published' }).isDecision).toBe(false);
  });
});

describe('actionLabel()', () => {
  it('should return the correct Hebrew label for each action', () => {
    expect(mockApprovalEntry({ action: 'submitted' }).actionLabel()).toBe('נשלח לביקורת');
    expect(mockApprovalEntry({ action: 'approved' }).actionLabel()).toBe('אושר');
    expect(mockApprovalEntry({ action: 'changes_requested' }).actionLabel()).toBe('נדרשו תיקונים');
    expect(mockApprovalEntry({ action: 'rejected' }).actionLabel()).toBe('נדחה');
    expect(mockApprovalEntry({ action: 'published' }).actionLabel()).toBe('פורסם');
    expect(mockApprovalEntry({ action: 'restored' }).actionLabel()).toBe('שוחזר');
  });
});

describe('mockApprovalEntries()', () => {
  it('should return a full approval trail with 6 entries', () => {
    const entries = mockApprovalEntries();
    expect(entries).toHaveLength(6);
  });

  it('should follow the created -> submitted -> changes_requested -> submitted -> approved -> published flow', () => {
    const entries = mockApprovalEntries();
    expect(entries.map((entry) => entry.action)).toEqual([
      'created',
      'submitted',
      'changes_requested',
      'submitted',
      'approved',
      'published',
    ]);
  });

  it('should share the same draftId across all entries', () => {
    const entries = mockApprovalEntries();
    const draftId = entries[0].draftId;
    entries.forEach((entry) => {
      expect(entry.draftId).toBe(draftId);
    });
  });
});
