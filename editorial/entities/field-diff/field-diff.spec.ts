import { FieldDiff, diffPayloads, summarizeDiff } from './field-diff.js';
import { mockFieldDiffs } from './field-diff.mock.js';

it('has a FieldDiff.from() method', () => {
  expect(FieldDiff.from).toBeTruthy();
});

describe('diffPayloads()', () => {
  it('detects a modified field', () => {
    const diffs = diffPayloads(
      { title: 'ישן' },
      { title: 'חדש' },
      { title: 'כותרת' }
    );

    const titleDiff = diffs.find((diff) => diff.field === 'title');
    expect(titleDiff?.changeKind).toBe('modified');
    expect(titleDiff?.before).toBe('ישן');
    expect(titleDiff?.after).toBe('חדש');
    expect(titleDiff?.label).toBe('כותרת');
  });

  it('detects an added field', () => {
    const diffs = diffPayloads({}, { status: 'draft' }, { status: 'סטטוס' });

    const statusDiff = diffs.find((diff) => diff.field === 'status');
    expect(statusDiff?.changeKind).toBe('added');
    expect(statusDiff?.before).toBeUndefined();
    expect(statusDiff?.after).toBe('draft');
  });

  it('detects a removed field', () => {
    const diffs = diffPayloads({ authorName: 'ישראל' }, {});

    const authorDiff = diffs.find((diff) => diff.field === 'authorName');
    expect(authorDiff?.changeKind).toBe('removed');
    expect(authorDiff?.before).toBe('ישראל');
    expect(authorDiff?.after).toBeUndefined();
  });

  it('detects an unchanged field, including nested objects and arrays', () => {
    const diffs = diffPayloads(
      { domains: ['הלכה', 'מוסר'], meta: { a: 1, b: 2 } },
      { domains: ['הלכה', 'מוסר'], meta: { b: 2, a: 1 } }
    );

    const domainsDiff = diffs.find((diff) => diff.field === 'domains');
    const metaDiff = diffs.find((diff) => diff.field === 'meta');

    expect(domainsDiff?.changeKind).toBe('unchanged');
    expect(metaDiff?.changeKind).toBe('unchanged');
  });

  it('detects a modified field for nested objects and arrays with different content', () => {
    const diffs = diffPayloads(
      { domains: ['הלכה'] },
      { domains: ['הלכה', 'מוסר'] }
    );

    const domainsDiff = diffs.find((diff) => diff.field === 'domains');
    expect(domainsDiff?.changeKind).toBe('modified');
  });

  it('falls back to the field key when no label is provided', () => {
    const diffs = diffPayloads({ payload: 'a' }, { payload: 'b' });
    const payloadDiff = diffs.find((diff) => diff.field === 'payload');
    expect(payloadDiff?.label).toBe('payload');
  });

  it('handles missing before/after objects gracefully', () => {
    expect(() => diffPayloads(undefined as any, undefined as any)).not.toThrow();
    expect(diffPayloads(undefined as any, undefined as any)).toEqual([]);
  });
});

describe('summarizeDiff()', () => {
  it('summarizes modified, added and removed fields together', () => {
    const diffs = diffPayloads(
      { title: 'ישן', authorName: 'ישראל' },
      { title: 'חדש', status: 'draft' }
    );

    const summary = summarizeDiff(diffs);
    expect(summary).toContain('עודכן שדה אחד');
    expect(summary).toContain('נוסף שדה אחד');
    expect(summary).toContain('הוסר שדה אחד');
  });

  it('returns a no-changes message when nothing changed', () => {
    const diffs = diffPayloads({ status: 'draft' }, { status: 'draft' });
    expect(summarizeDiff(diffs)).toBe('לא בוצעו שינויים');
  });

  it('pluralizes multiple modified fields', () => {
    const diffs = diffPayloads(
      { a: 1, b: 2, c: 3 },
      { a: 10, b: 20, c: 30 }
    );
    expect(summarizeDiff(diffs)).toBe('עודכנו 3 שדות');
  });

  it('works with mock field diffs', () => {
    const diffs = mockFieldDiffs();
    const summary = summarizeDiff(diffs);
    expect(typeof summary).toBe('string');
    expect(summary.length).toBeGreaterThan(0);
  });
});
