import { FieldDiff, type PlainFieldDiff } from './field-diff.js';

/**
 * creates mock FieldDiff instances for development and testing purposes.
 * supports partial overrides per entry.
 */
export function mockFieldDiffs(overrides: Partial<PlainFieldDiff>[] = []): FieldDiff[] {
  const defaults: PlainFieldDiff[] = [
    {
      field: 'title',
      label: 'כותרת',
      before: 'כותרת ישנה',
      after: 'כותרת חדשה',
      changeKind: 'modified',
    },
    {
      field: 'domains',
      label: 'תחומים',
      before: undefined,
      after: ['הלכה', 'מוסר'],
      changeKind: 'added',
    },
    {
      field: 'authorName',
      label: 'שם המחבר',
      before: 'ישראל ישראלי',
      after: undefined,
      changeKind: 'removed',
    },
    {
      field: 'status',
      label: 'סטטוס',
      before: 'draft',
      after: 'draft',
      changeKind: 'unchanged',
    },
  ];

  const merged = defaults.map((mock, index) => ({
    ...mock,
    ...(overrides[index] || {}),
  }));

  return merged.map((plainFieldDiff) => FieldDiff.from(plainFieldDiff));
}
