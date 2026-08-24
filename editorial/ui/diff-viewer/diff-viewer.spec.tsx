import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { FieldDiff, type PlainFieldDiff } from '@helemclub/editorial.entities.field-diff';
import { DiffViewer } from './diff-viewer.js';
import styles from './diff-viewer.module.scss';

function buildDiffs(overrides: PlainFieldDiff[]): FieldDiff[] {
  return overrides.map((plain) => FieldDiff.from(plain));
}

const changedDiffs = buildDiffs([
  {
    field: `title`,
    label: `כותרת`,
    before: `ישן`,
    after: `חדש`,
    changeKind: `modified`,
  },
  {
    field: `summary`,
    label: `תקציר`,
    before: undefined,
    after: `תקציר חדש`,
    changeKind: `added`,
  },
  {
    field: `status`,
    label: `סטטוס`,
    before: `draft`,
    after: `draft`,
    changeKind: `unchanged`,
  },
]);

const allUnchangedDiffs = buildDiffs([
  {
    field: `title`,
    label: `כותרת`,
    before: `זהה`,
    after: `זהה`,
    changeKind: `unchanged`,
  },
]);

it(`should render the from and to labels`, () => {
  const { getByText } = render(
    <MockProvider>
      <DiffViewer diffs={changedDiffs} fromLabel="גרסה 1" toLabel="גרסה 2" />
    </MockProvider>
  );

  expect(getByText(`גרסה 1`)).toBeTruthy();
  expect(getByText(`גרסה 2`)).toBeTruthy();
});

it(`should hide unchanged fields by default`, () => {
  const { container, queryByText } = render(
    <MockProvider>
      <DiffViewer diffs={changedDiffs} />
    </MockProvider>
  );

  expect(container.querySelectorAll(`.${styles.fieldLabel}`).length).toBeGreaterThan(0);
  expect(queryByText(`סטטוס`)).toBeNull();
});

it(`should show unchanged fields after clicking the toggle button`, () => {
  const { container, queryAllByText } = render(
    <MockProvider>
      <DiffViewer diffs={changedDiffs} />
    </MockProvider>
  );

  expect(queryAllByText(`סטטוס`).length).toBe(0);

  const toggleButton = container.querySelector(`.${styles.toggleButton}`) as HTMLButtonElement;
  fireEvent.click(toggleButton);

  expect(queryAllByText(`סטטוס`).length).toBeGreaterThan(0);
});

it(`should render an empty state when there are no changes`, () => {
  const { container } = render(
    <MockProvider>
      <DiffViewer diffs={allUnchangedDiffs} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.emptyState}`)).toBeTruthy();
});
