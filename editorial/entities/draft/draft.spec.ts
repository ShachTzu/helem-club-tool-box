import { Draft, canTransition } from './draft.js';
import { mockDrafts } from './draft.mock.js';

it('has a Draft.from() method', () => {
  expect(Draft.from).toBeTruthy();
});

it('should create a Draft instance from a plain object', () => {
  const draft = Draft.from({
    id: 'draft-1',
    contentType: 'post',
    title: 'כותרת לדוגמה',
    payload: { body: 'תוכן' },
    domains: ['תעסוקה'],
    status: 'draft',
    authorId: 'user-1',
    authorName: 'ישראל ישראלי',
    currentVersion: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  });

  expect(draft).toBeInstanceOf(Draft);
  expect(draft.title).toEqual('כותרת לדוגמה');
});

it('should serialize a Draft back into a plain object with toObject()', () => {
  const plain = {
    id: 'draft-2',
    contentType: 'post',
    title: 'כותרת נוספת',
    payload: { body: 'תוכן נוסף' },
    domains: ['דיור'],
    status: 'in_review' as const,
    authorId: 'user-2',
    authorName: 'דנה כהן',
    currentVersion: 2,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  };

  const draft = Draft.from(plain);

  expect(draft.toObject()).toEqual(plain);
});

it('should expose isEditable as true for draft status', () => {
  const draft = Draft.from({
    id: 'draft-3',
    contentType: 'post',
    title: 'טיוטה',
    payload: {},
    domains: [],
    status: 'draft',
    authorId: 'user-3',
    authorName: 'משתמש',
    currentVersion: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  });

  expect(draft.isEditable).toBe(true);
  expect(draft.isPending).toBe(false);
});

it('should expose needsAttention as true for changes_requested status', () => {
  const draft = Draft.from({
    id: 'draft-4',
    contentType: 'post',
    title: 'טיוטה',
    payload: {},
    domains: [],
    status: 'changes_requested',
    authorId: 'user-4',
    authorName: 'משתמש',
    currentVersion: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  });

  expect(draft.needsAttention).toBe(true);
  expect(draft.isEditable).toBe(true);
});

it('should expose isPublished as true for published status', () => {
  const draft = Draft.from({
    id: 'draft-5',
    contentType: 'post',
    title: 'טיוטה',
    payload: {},
    domains: [],
    status: 'published',
    authorId: 'user-5',
    authorName: 'משתמש',
    currentVersion: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  });

  expect(draft.isPublished).toBe(true);
});

it('should allow legal transitions', () => {
  expect(canTransition('draft', 'in_review')).toBe(true);
  expect(canTransition('in_review', 'approved')).toBe(true);
  expect(canTransition('in_review', 'changes_requested')).toBe(true);
  expect(canTransition('in_review', 'archived')).toBe(true);
  expect(canTransition('changes_requested', 'in_review')).toBe(true);
  expect(canTransition('approved', 'published')).toBe(true);
  expect(canTransition('published', 'archived')).toBe(true);
});

it('should reject illegal transitions', () => {
  expect(canTransition('draft', 'published')).toBe(false);
  expect(canTransition('archived', 'draft')).toBe(false);
  expect(canTransition('published', 'draft')).toBe(false);
});

it('should provide 6 mock drafts with different statuses', () => {
  const drafts = mockDrafts();

  expect(drafts).toHaveLength(6);
  drafts.forEach((draft) => {
    expect(draft).toBeInstanceOf(Draft);
  });

  const statuses = drafts.map((draft) => draft.status);
  expect(new Set(statuses).size).toBeGreaterThan(1);
});

it('should support partial overrides in mockDrafts()', () => {
  const drafts = mockDrafts([{ title: 'כותרת מותאמת אישית' }]);

  expect(drafts[0].title).toEqual('כותרת מותאמת אישית');
});
