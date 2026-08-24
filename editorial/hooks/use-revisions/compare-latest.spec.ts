import { mockRevisions } from '@helemclub/editorial.entities.revision';
import { compareLatest } from './compare-latest.js';

it('should compare the two latest revisions by version number', () => {
  const revisions = mockRevisions();

  const diffs = compareLatest(revisions);
  const titleDiff = diffs.find((diff) => diff.field === 'title');

  expect(titleDiff?.changeKind).toBe('unchanged');
  expect(diffs.length).toBeGreaterThan(0);
});

it('should ignore input order and compare by versionNumber', () => {
  const revisions = mockRevisions();
  const shuffled = [...revisions].reverse();

  const diffs = compareLatest(shuffled);
  const orderedDiffs = compareLatest(revisions);

  expect(diffs).toEqual(orderedDiffs);
});

it('should return an empty array when fewer than two revisions are given', () => {
  const revisions = mockRevisions();

  expect(compareLatest([revisions[0]])).toEqual([]);
  expect(compareLatest([])).toEqual([]);
});
