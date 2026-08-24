import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { FieldDiff, type PlainFieldDiff } from '@helemclub/editorial.entities.field-diff';
import { DiffViewer } from './diff-viewer.js';

const multipleChangesDiffs: PlainFieldDiff[] = [
  {
    field: `title`,
    label: `כותרת`,
    before: `הרצאה על התמודדות עם חרדה`,
    after: `הרצאה על התמודדות עם חרדה ולחץ`,
    changeKind: `modified`,
  },
  {
    field: `domains`,
    label: `תחומים`,
    before: [`חרדה`],
    after: [`חרדה`, `לחץ פוסט-טראומטי`],
    changeKind: `modified`,
  },
  {
    field: `summary`,
    label: `תקציר`,
    before: undefined,
    after: `תקציר חדש שנוסף לכתבה ומסביר את עיקרי הדברים.`,
    changeKind: `added`,
  },
  {
    field: `coAuthorName`,
    label: `שם שותף לכתיבה`,
    before: `דנה כהן`,
    after: undefined,
    changeKind: `removed`,
  },
  {
    field: `status`,
    label: `סטטוס`,
    before: `in_review`,
    after: `in_review`,
    changeKind: `unchanged`,
  },
  {
    field: `authorName`,
    label: `שם המחבר`,
    before: `ישראל ישראלי`,
    after: `ישראל ישראלי`,
    changeKind: `unchanged`,
  },
];

const additionOnlyDiffs: PlainFieldDiff[] = [
  {
    field: `videoUrl`,
    label: `קישור לסרטון`,
    before: undefined,
    after: `https://example.com/videos/lecture-42`,
    changeKind: `added`,
  },
  {
    field: `tags`,
    label: `תגיות`,
    before: undefined,
    after: [`חרדה`, `כלים מעשיים`, `הרצאה`],
    changeKind: `added`,
  },
  {
    field: `title`,
    label: `כותרת`,
    before: `הרצאה על התמודדות עם חרדה`,
    after: `הרצאה על התמודדות עם חרדה`,
    changeKind: `unchanged`,
  },
];

const noChangesDiffs: PlainFieldDiff[] = [
  {
    field: `title`,
    label: `כותרת`,
    before: `מדריך לתמיכה בבני משפחה`,
    after: `מדריך לתמיכה בבני משפחה`,
    changeKind: `unchanged`,
  },
  {
    field: `authorName`,
    label: `שם המחבר`,
    before: `רחל לוי`,
    after: `רחל לוי`,
    changeKind: `unchanged`,
  },
  {
    field: `status`,
    label: `סטטוס`,
    before: `approved`,
    after: `approved`,
    changeKind: `unchanged`,
  },
];

export const MultipleChangesDiff = () => {
  const diffs = multipleChangesDiffs.map((plain) => FieldDiff.from(plain));
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <DiffViewer diffs={diffs} fromLabel="גרסה 2" toLabel="גרסה 3" />
      </div>
    </MockProvider>
  );
};

export const AdditionOnlyDiff = () => {
  const diffs = additionOnlyDiffs.map((plain) => FieldDiff.from(plain));
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <DiffViewer diffs={diffs} fromLabel="גרסה 1" toLabel="גרסה 2" />
      </div>
    </MockProvider>
  );
};

export const NoChangesDiff = () => {
  const diffs = noChangesDiffs.map((plain) => FieldDiff.from(plain));
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <DiffViewer diffs={diffs} fromLabel="גרסה 4" toLabel="גרסה 5" />
      </div>
    </MockProvider>
  );
};
