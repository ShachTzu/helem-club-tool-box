import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Hero } from './hero.js';
import styles from './hero.module.scss';

it(`should render the default headline`, () => {
  const { container } = render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  );
  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`מקום אחד, מסודר ונגיש — לכל מי שמתמודד`);
});

it(`should render a custom eyebrow and subtitle`, () => {
  const { container, getByText } = render(
    <MemoryRouter>
      <Hero eyebrow="עוגן קהילתי" subtitle="תיאור מותאם אישית לקטע הפתיחה." />
    </MemoryRouter>
  );
  expect(container.querySelector(`.${styles.eyebrow}`)?.textContent).toBe(`עוגן קהילתי`);
  expect(getByText(`תיאור מותאם אישית לקטע הפתיחה.`)).toBeTruthy();
});

it(`should render the primary cta with the provided label and href`, () => {
  const { getByText } = render(
    <MemoryRouter>
      <Hero primaryCta={{ label: `לצפייה בסדנאות`, href: `/knowledge/workshops` }} />
    </MemoryRouter>
  );
  const link = getByText(`לצפייה בסדנאות`).closest(`a`);
  expect(link?.getAttribute(`href`)).toBe(`/knowledge/workshops`);
});

it(`should render the secondary cta as an internal link by default`, () => {
  const { container, getByText } = render(
    <MemoryRouter>
      <Hero secondaryCta={{ label: `קראו עוד`, href: `/blog` }} />
    </MemoryRouter>
  );
  const link = getByText(`קראו עוד`).closest(`a`);
  expect(link?.getAttribute(`href`)).toBe(`/blog`);
  expect(link?.className.includes(styles.ghostLink)).toBe(true);
  expect(container.querySelector(`.${styles.ghostLink}`)).toBeTruthy();
});

it(`should render the secondary cta as an external link when marked external`, () => {
  const { getByText } = render(
    <MemoryRouter>
      <Hero secondaryCta={{ label: `אתר חיצוני`, href: `https://example.org`, external: true }} />
    </MemoryRouter>
  );
  const link = getByText(`אתר חיצוני`).closest(`a`);
  expect(link?.getAttribute(`target`)).toBe(`_blank`);
  expect(link?.getAttribute(`href`)).toContain(`https://example.org`);
});
