import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockSearchResult } from '@helemclub/platform.entities.search-result';
import { GlobalSearch } from './global-search.js';
import styles from './global-search.module.scss';

const MOCK_RESULTS = [
  mockSearchResult({ id: `1`, type: `app`, title: `נשימה 4-7-8` }),
  mockSearchResult({
    id: `2`,
    type: `blog`,
    title: `איך להתמודד עם מחשבות טורדניות`,
    excerpt: `מאמר על טכניקות מעשיות`,
    imageUrl: undefined,
  }),
];

it('should render the search input with the default hebrew placeholder', () => {
  const { container } = render(
    <MockProvider>
      <GlobalSearch mockResults={MOCK_RESULTS} />
    </MockProvider>
  );

  const input = container.querySelector(`.${styles.input}`) as HTMLInputElement;
  expect(input.placeholder).toBe(`חיפוש לפי תסמין, נושא או כלי`);
});

it('should render a custom placeholder when provided', () => {
  const { container } = render(
    <MockProvider>
      <GlobalSearch mockResults={MOCK_RESULTS} placeholder="חפשו כאן" />
    </MockProvider>
  );

  const input = container.querySelector(`.${styles.input}`) as HTMLInputElement;
  expect(input.placeholder).toBe(`חפשו כאן`);
});

it('should show grouped results once a query is typed and the input is focused', async () => {
  const { container } = render(
    <MockProvider>
      <GlobalSearch mockResults={MOCK_RESULTS} />
    </MockProvider>
  );

  const input = container.querySelector(`.${styles.input}`) as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: `נשימה` } });

  await waitFor(() => {
    const groupLabels = container.querySelectorAll(`.${styles.groupLabel}`);
    expect(groupLabels.length).toBeGreaterThan(0);
  });

  const resultItems = container.querySelectorAll(`.${styles.resultItem}`);
  expect(resultItems.length).toBe(MOCK_RESULTS.length);
});

it('should call onResultSelect when a result is clicked', async () => {
  const handleSelect = vi.fn();
  const { container } = render(
    <MockProvider>
      <GlobalSearch mockResults={MOCK_RESULTS} onResultSelect={handleSelect} />
    </MockProvider>
  );

  const input = container.querySelector(`.${styles.input}`) as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: `נשימה` } });

  await waitFor(() => {
    expect(container.querySelectorAll(`.${styles.resultItem}`).length).toBe(MOCK_RESULTS.length);
  });

  const firstResult = container.querySelector(`.${styles.resultItem}`) as HTMLButtonElement;
  fireEvent.click(firstResult);

  expect(handleSelect).toHaveBeenCalledTimes(1);
});

it('should clear the query when the clear button is clicked', async () => {
  const { container } = render(
    <MockProvider>
      <GlobalSearch mockResults={MOCK_RESULTS} />
    </MockProvider>
  );

  const input = container.querySelector(`.${styles.input}`) as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: `נשימה` } });

  await waitFor(() => {
    expect(container.querySelector(`.${styles.clearButton}`)).toBeTruthy();
  });

  const clearButton = container.querySelector(`.${styles.clearButton}`) as HTMLButtonElement;
  fireEvent.click(clearButton);

  expect(input.value).toBe(``);
});
