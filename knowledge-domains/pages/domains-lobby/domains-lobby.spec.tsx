import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { DomainsLobby } from './domains-lobby.js';
import { mockLobbyDomains, mockLobbyContent } from './domains-lobby.mock.js';
import styles from './domains-lobby.module.scss';

it('should render all mocked domains on the lobby page', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={['/domains']}>
        <DomainsLobby mockDomains={mockLobbyDomains} />
      </MemoryRouter>
    </MockedProvider>
  );

  const cards = container.querySelectorAll(`.${styles.domainCard}`);
  expect(cards.length).toBe(mockLobbyDomains.length);
});

it('should render domain names as titles', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={['/domains']}>
        <DomainsLobby mockDomains={mockLobbyDomains} />
      </MemoryRouter>
    </MockedProvider>
  );

  const titles = container.querySelectorAll(`.${styles.domainCardTitle}`);
  const titleTexts = Array.from(titles).map((title) => title.textContent);
  expect(titleTexts).toContain(mockLobbyDomains[0].name);
});

it('should link each domain card to the domain slug page', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={['/domains']}>
        <DomainsLobby mockDomains={mockLobbyDomains} />
      </MemoryRouter>
    </MockedProvider>
  );

  const firstCard = container.querySelector(`.${styles.domainCard}`) as HTMLAnchorElement;
  expect(firstCard.getAttribute('href')).toContain(`/domains/${mockLobbyDomains[0].slug}`);
});

it('should render the cross-sliced content feed for a selected domain', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={[`/domains/${mockLobbyDomains[0].slug}`]}>
        <Routes>
          <Route
            path="/domains/:slug"
            element={<DomainsLobby mockDomains={mockLobbyDomains} mockContent={mockLobbyContent} />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  const cards = container.querySelectorAll(`.${styles.contentCard}`);
  expect(cards.length).toBe(mockLobbyContent.length);
});

it('should render an empty state when the selected domain has no content', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={[`/domains/${mockLobbyDomains[0].slug}`]}>
        <Routes>
          <Route
            path="/domains/:slug"
            element={<DomainsLobby mockDomains={mockLobbyDomains} mockContent={[]} />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  const cards = container.querySelectorAll(`.${styles.contentCard}`);
  expect(cards.length).toBe(0);
});

it('should render a not-found empty state for an unknown domain slug', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={[`/domains/unknown-domain`]}>
        <Routes>
          <Route
            path="/domains/:slug"
            element={<DomainsLobby mockDomains={mockLobbyDomains} mockContent={[]} />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  const cards = container.querySelectorAll(`.${styles.domainCard}`);
  const contentCards = container.querySelectorAll(`.${styles.contentCard}`);
  expect(cards.length).toBe(0);
  expect(contentCards.length).toBe(0);
});

it('should navigate back to the lobby via the back link click', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter initialEntries={[`/domains/${mockLobbyDomains[0].slug}`]}>
        <Routes>
          <Route
            path="/domains/:slug"
            element={<DomainsLobby mockDomains={mockLobbyDomains} mockContent={mockLobbyContent} />}
          />
          <Route path="/domains" element={<DomainsLobby mockDomains={mockLobbyDomains} />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  const backLink = container.querySelector(`.${styles.backLink}`) as HTMLAnchorElement;
  expect(backLink).toBeTruthy();
  fireEvent.click(backLink);
  const cards = container.querySelectorAll(`.${styles.domainCard}`);
  expect(cards.length).toBe(mockLobbyDomains.length);
});
