import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Heading } from './heading.js';
import styles from './heading.module.scss';

describe('Heading', () => {
  it('should render its children text', () => {
    const { container } = render(
      <MemoryRouter>
        <Heading level={1}>כותרת לדוגמה</Heading>
      </MemoryRouter>
    );
    const rendered = container.querySelector(`.${styles.heading}`);
    expect(rendered).toBeTruthy();
    expect(rendered?.textContent).toBe('כותרת לדוגמה');
  });

  it('should render an h1 element by default for level 1', () => {
    const { container } = render(
      <MemoryRouter>
        <Heading level={1}>כותרת ראשית</Heading>
      </MemoryRouter>
    );
    const rendered = container.querySelector('h1');
    expect(rendered).toBeTruthy();
  });

  it('should render a custom element when `as` is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <Heading level={2} as="div">
          כותרת בתוך div
        </Heading>
      </MemoryRouter>
    );
    const heading = container.querySelector('h2');
    const div = container.querySelector('div.' + styles.heading);
    expect(heading).toBeFalsy();
    expect(div).toBeTruthy();
  });

  it('should apply the level class matching the given level', () => {
    const { container } = render(
      <MemoryRouter>
        <Heading level={3}>כותרת שלישית</Heading>
      </MemoryRouter>
    );
    const rendered = container.querySelector(`.${styles.level3}`);
    expect(rendered).toBeTruthy();
  });

  it('should apply the alignment class', () => {
    const { container } = render(
      <MemoryRouter>
        <Heading level={2} align="left">
          כותרת משמאל
        </Heading>
      </MemoryRouter>
    );
    const rendered = container.querySelector(`.${styles.left}`);
    expect(rendered).toBeTruthy();
  });
});
