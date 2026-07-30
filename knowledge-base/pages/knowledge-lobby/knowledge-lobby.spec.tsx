import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { KnowledgeLobby } from './knowledge-lobby.js';
import {
  mockKnowledgeLobbyLabels,
  mockKnowledgeLobbyRecords,
  mockKnowledgeLobbyDomains,
} from './knowledge-lobby.mock.js';
import styles from './knowledge-lobby.module.scss';

it('should render a card for every mocked label', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter>
        <KnowledgeLobby
          mockLabels={mockKnowledgeLobbyLabels}
          mockRecords={mockKnowledgeLobbyRecords}
          mockDomains={mockKnowledgeLobbyDomains}
        />
      </MemoryRouter>
    </MockedProvider>
  );

  const labelCards = container.querySelectorAll(`.${styles.labelsGrid} a`);
  expect(labelCards.length).toBe(mockKnowledgeLobbyLabels.length);
});

it('should render a card for every mocked record in the discovery feed', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter>
        <KnowledgeLobby
          mockLabels={mockKnowledgeLobbyLabels}
          mockRecords={mockKnowledgeLobbyRecords}
          mockDomains={mockKnowledgeLobbyDomains}
        />
      </MemoryRouter>
    </MockedProvider>
  );

  const recordCards = container.querySelectorAll(`.${styles.recordsGrid} > *`);
  expect(recordCards.length).toBe(mockKnowledgeLobbyRecords.length);
});

it('should filter the discovery feed when a domain chip is toggled', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter>
        <KnowledgeLobby
          mockLabels={mockKnowledgeLobbyLabels}
          mockRecords={mockKnowledgeLobbyRecords}
          mockDomains={mockKnowledgeLobbyDomains}
        />
      </MemoryRouter>
    </MockedProvider>
  );

  const firstChip = container.querySelector(`.${styles.filterBar} button`) as HTMLButtonElement;
  expect(firstChip).toBeTruthy();
  fireEvent.click(firstChip);

  const recordCards = container.querySelectorAll(`.${styles.recordsGrid} > *`);
  const expectedCount = mockKnowledgeLobbyRecords.filter((record) =>
    (record.domains || []).includes(mockKnowledgeLobbyDomains[0].id)
  ).length;
  expect(recordCards.length).toBe(expectedCount);
});

it('should render an empty message when the discovery feed has no records', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter>
        <KnowledgeLobby
          mockLabels={mockKnowledgeLobbyLabels}
          mockRecords={[]}
          mockDomains={mockKnowledgeLobbyDomains}
        />
      </MemoryRouter>
    </MockedProvider>
  );

  const emptyMessage = container.querySelector(`.${styles.emptyMessage}`);
  expect(emptyMessage).toBeTruthy();
});
