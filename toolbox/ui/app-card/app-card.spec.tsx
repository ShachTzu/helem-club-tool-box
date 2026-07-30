import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppCard } from './app-card.js';
import styles from './app-card.module.scss';

describe(`AppCard`, () => {
  it(`should render the app name and subtitle`, () => {
    const { container } = render(
      <MemoryRouter>
        <AppCard name="נשימה רגועה" subtitle="תרגילי נשימה מודרכים" />
      </MemoryRouter>
    );

    const name = container.querySelector(`.${styles.name}`);
    const subtitle = container.querySelector(`.${styles.subtitle}`);

    expect(name?.textContent).toBe(`נשימה רגועה`);
    expect(subtitle?.textContent).toBe(`תרגילי נשימה מודרכים`);
  });

  it(`should render the featured badge when isFeatured is true`, () => {
    const { container } = render(
      <MemoryRouter>
        <AppCard isFeatured />
      </MemoryRouter>
    );

    const featuredBadge = container.querySelector(`.${styles.featuredBadge}`);
    expect(featuredBadge).toBeTruthy();
  });

  it(`should not render the featured badge when isFeatured is false`, () => {
    const { container } = render(
      <MemoryRouter>
        <AppCard isFeatured={false} />
      </MemoryRouter>
    );

    const featuredBadge = container.querySelector(`.${styles.featuredBadge}`);
    expect(featuredBadge).toBeFalsy();
  });

  it(`should render a fallback message when there are no ratings`, () => {
    const { container } = render(
      <MemoryRouter>
        <AppCard ratingCount={0} />
      </MemoryRouter>
    );

    const noRating = container.querySelector(`.${styles.noRating}`);
    expect(noRating?.textContent).toContain(`אין עדיין ביקורות`);
  });

  it(`should render the click count`, () => {
    const { container } = render(
      <MemoryRouter>
        <AppCard clickCount={1240} />
      </MemoryRouter>
    );

    const clickCount = container.querySelector(`.${styles.clickCount}`);
    expect(clickCount?.textContent).toContain(`1,240`);
  });

  it(`should link to the app detail page`, () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/`]}>
        <AppCard href="/toolbox/breathe-calm" />
      </MemoryRouter>
    );

    const cardLink = container.querySelector(`.${styles.cardLink}`) as HTMLAnchorElement;
    expect(cardLink.getAttribute(`href`)).toBe(`/toolbox/breathe-calm`);
  });
});
