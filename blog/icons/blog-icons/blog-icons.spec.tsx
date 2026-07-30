import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleIcon, EditIcon, SubmitIcon, MembersOnlyIcon, StatsIcon } from './blog-icons.js';

describe(`blog-icons`, () => {
  it(`should render the article icon with an accessible label`, () => {
    const { container } = render(
      <MemoryRouter>
        <ArticleIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector(`svg`);
    expect(svg?.getAttribute(`aria-label`)).toBe(`כתבה`);
  });

  it(`should render the edit icon with a custom title`, () => {
    const { container } = render(
      <MemoryRouter>
        <EditIcon title="ערוך כתבה" />
      </MemoryRouter>
    );
    const svg = container.querySelector(`svg`);
    expect(svg?.getAttribute(`aria-label`)).toBe(`ערוך כתבה`);
  });

  it(`should render the submit icon`, () => {
    const { container } = render(
      <MemoryRouter>
        <SubmitIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector(`svg`);
    expect(svg).toBeTruthy();
  });

  it(`should render the members-only icon`, () => {
    const { container } = render(
      <MemoryRouter>
        <MembersOnlyIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector(`svg`);
    expect(svg?.getAttribute(`aria-label`)).toBe(`לחברי קהילה בלבד`);
  });

  it(`should render the stats icon with a custom class name`, () => {
    const { container } = render(
      <MemoryRouter>
        <StatsIcon className="custom-stats-icon" />
      </MemoryRouter>
    );
    const svg = container.querySelector(`svg`);
    expect(svg?.classList.contains(`custom-stats-icon`)).toBe(true);
  });

  it(`should apply a custom pixel size`, () => {
    const { container } = render(
      <MemoryRouter>
        <ArticleIcon size={48} />
      </MemoryRouter>
    );
    const svg = container.querySelector(`svg`);
    expect(svg?.style.width).toBe(`48px`);
  });
});
