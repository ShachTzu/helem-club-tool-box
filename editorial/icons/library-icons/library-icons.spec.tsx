import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DraftIcon } from './draft-icon.js';
import { ReviewIcon } from './review-icon.js';
import { ApproveIcon } from './approve-icon.js';
import { RejectIcon } from './reject-icon.js';
import { HistoryIcon } from './history-icon.js';
import { LibraryIcon } from './library-icon.js';

it('should render the draft icon with an accessible label', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftIcon title="טיוטה" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
  expect(svg?.getAttribute('aria-label')).toBe('טיוטה');
});

it('should render the review icon as decorative when no title is passed', () => {
  const { container } = render(
    <MemoryRouter>
      <ReviewIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-hidden')).toBe('true');
});

it('should apply a custom class name to the approve icon', () => {
  const { container } = render(
    <MemoryRouter>
      <ApproveIcon className="custom-approve" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg.custom-approve');
  expect(svg).toBeTruthy();
});

it('should render the reject icon svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <RejectIcon title="נדחה" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should render the history icon with multiple path elements', () => {
  const { container } = render(
    <MemoryRouter>
      <HistoryIcon title="היסטוריה" />
    </MemoryRouter>
  );
  const paths = container.querySelectorAll('path');
  expect(paths.length).toBeGreaterThan(1);
});

it('should render the library icon with rectangles', () => {
  const { container } = render(
    <MemoryRouter>
      <LibraryIcon title="ספריית הידע" />
    </MemoryRouter>
  );
  const rects = container.querySelectorAll('rect');
  expect(rects.length).toBe(3);
});
