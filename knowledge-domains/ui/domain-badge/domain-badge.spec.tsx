import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainBadge } from './domain-badge.js';
import styles from './domain-badge.module.scss';

const domains = [
  { id: 'anxiety', slug: 'anxiety', name: `חרדה` },
  { id: 'sleep', slug: 'sleep', name: `שינה` },
];

it('should render a chip link for each domain', () => {
  const { container } = render(
    <MockProvider>
      <DomainBadge domains={domains} />
    </MockProvider>
  );
  const links = container.querySelectorAll(`.${styles.chipLink}`);
  expect(links.length).toBe(2);
});

it('should link each chip to the domain lobby using the given base path', () => {
  const { container } = render(
    <MockProvider>
      <DomainBadge domains={domains} domainLinkBase="/knowledge/domains" />
    </MockProvider>
  );
  const link = container.querySelector(`.${styles.chipLink}`) as HTMLAnchorElement;
  expect(link.getAttribute('href')).toBe('/knowledge/domains/anxiety');
});

it('should render nothing when no domains are provided', () => {
  const { container } = render(
    <MockProvider>
      <DomainBadge domains={[]} />
    </MockProvider>
  );
  expect(container.querySelector(`.${styles.domainBadge}`)).toBeNull();
});

it('should render the domain label text', () => {
  const { getByText } = render(
    <MockProvider>
      <DomainBadge domains={domains} />
    </MockProvider>
  );
  expect(getByText('חרדה')).toBeTruthy();
});

it('should apply a custom class name to the container', () => {
  const { container } = render(
    <MockProvider>
      <DomainBadge domains={domains} className="custom-domain-badge" />
    </MockProvider>
  );
  fireEvent.mouseEnter(container);
  const root = container.querySelector(`.${styles.domainBadge}`);
  expect(root?.classList.contains('custom-domain-badge')).toBe(true);
});
