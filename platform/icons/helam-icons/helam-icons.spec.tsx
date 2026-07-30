import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon } from './home-icon.js';
import { SearchIcon } from './search-icon.js';
import { BookmarkIcon } from './bookmark-icon.js';
import { ChevronIcon } from './chevron-icon.js';
import { DomainsIcon } from './domains-icon.js';

it('should render the home icon with an accessible label', () => {
  const { container } = render(
    <MemoryRouter>
      <HomeIcon title="בית" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
  expect(svg?.getAttribute('aria-label')).toBe('בית');
});

it('should render the search icon as decorative when no title is passed', () => {
  const { container } = render(
    <MemoryRouter>
      <SearchIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-hidden')).toBe('true');
});

it('should apply a custom class name to the bookmark icon', () => {
  const { container } = render(
    <MemoryRouter>
      <BookmarkIcon className="custom-bookmark" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg.custom-bookmark');
  expect(svg).toBeTruthy();
});

it('should rotate the chevron icon based on the direction prop', () => {
  const { container } = render(
    <MemoryRouter>
      <ChevronIcon direction="up" />
    </MemoryRouter>
  );
  const polyline = container.querySelector('polyline');
  expect(polyline?.getAttribute('transform')).toContain('180');
});

it('should render the domains icon svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <DomainsIcon title="דומיינים" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});
