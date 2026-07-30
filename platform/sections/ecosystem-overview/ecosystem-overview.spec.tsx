import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { EcosystemOverview } from './ecosystem-overview.js';
import { EcosystemPillar } from './ecosystem-pillar-type.js';
import styles from './ecosystem-overview.module.scss';

const TEST_PILLARS: EcosystemPillar[] = [
  {
    slug: `knowledge`,
    icon: `📚`,
    title: `מאגר ידע`,
    description: `תיאור מאגר הידע`,
    href: `/knowledge`,
  },
  {
    slug: `toolbox`,
    icon: `🧰`,
    title: `ארגז כלים`,
    description: `תיאור ארגז הכלים`,
    href: `/toolbox`,
  },
];

it(`should render the section title`, () => {
  const { getByText } = render(
    <MockProvider>
      <EcosystemOverview pillars={TEST_PILLARS} title="האקוסיסטם שלנו" />
    </MockProvider>
  );
  const rendered = getByText(`האקוסיסטם שלנו`);
  expect(rendered).toBeTruthy();
});

it(`should render a card for each provided pillar`, () => {
  const { container } = render(
    <MockProvider>
      <EcosystemOverview pillars={TEST_PILLARS} />
    </MockProvider>
  );
  const cards = container.querySelectorAll(`.${styles.pillarCard}`);
  expect(cards.length).toBe(TEST_PILLARS.length);
});

it(`should render pillar titles and link hrefs`, () => {
  const { container } = render(
    <MockProvider>
      <EcosystemOverview pillars={TEST_PILLARS} />
    </MockProvider>
  );
  const links = container.querySelectorAll(`.${styles.pillarLink}`) as NodeListOf<HTMLAnchorElement>;
  expect(links.length).toBe(TEST_PILLARS.length);
  expect(links[0].getAttribute(`href`)).toBe(`/knowledge`);
  expect(links[1].getAttribute(`href`)).toBe(`/toolbox`);
});

it(`should respond to click on a pillar link without throwing`, () => {
  const { container } = render(
    <MockProvider>
      <EcosystemOverview pillars={TEST_PILLARS} />
    </MockProvider>
  );
  const link = container.querySelector(`.${styles.pillarLink}`) as HTMLAnchorElement;
  expect(() => fireEvent.click(link)).not.toThrow();
});
