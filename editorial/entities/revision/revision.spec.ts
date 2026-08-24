import { Revision } from './revision.js';
import { mockRevision, mockRevisions } from './revision.mock.js';

it('has a Revision.from() method', () => {
  expect(Revision.from).toBeTruthy();
});

it('should create a Revision instance from a plain object', () => {
  const revision = Revision.from({
    id: 'revision-1',
    draftId: 'draft-1',
    versionNumber: 1,
    payload: { title: 'hello' },
    domains: ['general'],
    title: 'hello',
    authorId: 'user-1',
    authorName: 'John Doe',
    changeSummary: 'initial version',
    createdAt: '2024-01-01T00:00:00.000Z',
  });

  expect(revision).toBeInstanceOf(Revision);
  expect(revision.id).toBe('revision-1');
  expect(revision.draftId).toBe('draft-1');
  expect(revision.versionNumber).toBe(1);
});

it('should serialize a Revision into a plain object with toObject()', () => {
  const revision = mockRevision({ id: 'revision-1' });
  const plainRevision = revision.toObject();

  expect(plainRevision).toEqual({
    id: revision.id,
    draftId: revision.draftId,
    versionNumber: revision.versionNumber,
    payload: revision.payload,
    domains: revision.domains,
    title: revision.title,
    authorId: revision.authorId,
    authorName: revision.authorName,
    changeSummary: revision.changeSummary,
    createdAt: revision.createdAt,
  });
});

it('should mark version 1 as the initial revision', () => {
  const revision = mockRevision({ versionNumber: 1 });
  expect(revision.isInitial).toBe(true);
});

it('should not mark versions greater than 1 as the initial revision', () => {
  const revision = mockRevision({ versionNumber: 2 });
  expect(revision.isInitial).toBe(false);
});

it('should generate 4 sequential mock revisions of the same draft', () => {
  const revisions = mockRevisions();

  expect(revisions).toHaveLength(4);
  expect(new Set(revisions.map((revision) => revision.draftId)).size).toBe(1);
  expect(revisions.map((revision) => revision.versionNumber)).toEqual([1, 2, 3, 4]);
  expect(revisions[0].isInitial).toBe(true);
  expect(revisions[1].isInitial).toBe(false);
});
