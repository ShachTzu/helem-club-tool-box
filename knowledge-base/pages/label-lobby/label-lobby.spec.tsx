import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { LabelLobby } from './label-lobby.js';
import { mockFirstAidLabel, mockFirstAidRecords, mockLabelLobbyDomains } from './label-lobby.mock.js';
import styles from './label-lobby.module.scss';

function renderLabelLobby(path: string, props: Partial<React.ComponentProps<typeof LabelLobby>> = {}) {
  return render(
    <MockedProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/knowledge/:labelSlug"
            element={
              <LabelLobby
                mockLabel={mockFirstAidLabel}
                mockRecords={mockFirstAidRecords}
                mockDomains={mockLabelLobbyDomains}
                {...props}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );
}

it('should render the label name as the hero title', () => {
  const { container } = renderLabelLobby('/knowledge/first-aid');
  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(mockFirstAidLabel.name);
});

it('should render the label description as the hero subtitle', () => {
  const { container } = renderLabelLobby('/knowledge/first-aid');
  const subtitle = container.querySelector(`.${styles.subtitle}`);
  expect(subtitle?.textContent).toBe(mockFirstAidLabel.description);
});

it('should render a card for every mocked record', () => {
  const { container } = renderLabelLobby('/knowledge/first-aid');
  const cards = container.querySelectorAll(`.${styles.recordsGrid} > *`);
  expect(cards.length).toBe(mockFirstAidRecords.length);
});

it('should render the records count in the toolbar', () => {
  const { container } = renderLabelLobby('/knowledge/first-aid');
  const count = container.querySelector(`.${styles.recordsCount}`);
  expect(count?.textContent).toBe(`${mockFirstAidRecords.length} תכנים`);
});

it('should filter records by selected domain', () => {
  const { container } = renderLabelLobby('/knowledge/first-aid');
  const chips = container.querySelectorAll('button');
  const sleepChip = Array.from(chips).find((chip) => chip.textContent?.includes('שינה'));
  expect(sleepChip).toBeTruthy();

  fireEvent.click(sleepChip as HTMLButtonElement);

  const count = container.querySelector(`.${styles.recordsCount}`);
  expect(count?.textContent).toBe('1 תכנים');
});

it('should render a not-found empty state for an unknown label', async () => {
  const { container, findByText } = renderLabelLobby('/knowledge/unknown-project', {
    mockLabel: undefined,
    mockRecords: [],
  });
  const notFoundTitle = await findByText('הפרויקט לא נמצא');
  expect(notFoundTitle).toBeTruthy();
  const grid = container.querySelector(`.${styles.recordsGrid}`);
  expect(grid).toBeFalsy();
});

it('should render an empty state when no records match the filter', () => {
  const { container, queryByText } = renderLabelLobby('/knowledge/first-aid', { mockRecords: [] });
  expect(queryByText('לא נמצאו תכנים')).toBeTruthy();
  const grid = container.querySelector(`.${styles.recordsGrid}`);
  expect(grid).toBeFalsy();
});
