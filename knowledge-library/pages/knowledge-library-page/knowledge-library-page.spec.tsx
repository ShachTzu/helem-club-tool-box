import React from 'react';
import { render } from '@testing-library/react';
import { SeriesLandingView, ChapterView, NotFoundView } from './knowledge-library-page.compositions.js';
import { MOCK_ROOT, MOCK_SERIES, MOCK_CHAPTER_1, MOCK_CHAPTER_2 } from './knowledge-library-page.mock.js';

it('renders the breadcrumb up to the root for a nested page', () => {
  const { getByText } = render(<ChapterView />);
  expect(getByText('ספריית הידע')).toBeTruthy();
  expect(getByText(MOCK_ROOT.title)).toBeTruthy();
  expect(getByText(MOCK_SERIES.title)).toBeTruthy();
});

it('renders a tile for every child when the page has children (landing-style)', () => {
  const { getByText } = render(<SeriesLandingView />);
  expect(getByText(MOCK_CHAPTER_1.title)).toBeTruthy();
  expect(getByText(MOCK_CHAPTER_2.title)).toBeTruthy();
});

it('renders the body and a next-chapter link for a leaf page (chapter-style)', () => {
  const { getByText } = render(<ChapterView />);
  expect(getByText(MOCK_CHAPTER_1.body)).toBeTruthy();
  expect(getByText(`${MOCK_CHAPTER_2.title} →`)).toBeTruthy();
});

it('renders a not-found state for an unknown slug', () => {
  const { getByText } = render(<NotFoundView />);
  expect(getByText('העמוד לא נמצא.')).toBeTruthy();
});
