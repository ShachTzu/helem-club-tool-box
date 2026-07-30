import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './not-found-page.js';
import styles from './not-found-page.module.scss';

it(`should render the default title and message`, () => {
  const { getByText } = render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

  expect(getByText(`הדף הזה איננו`)).toBeTruthy();
  expect(getByText(`404`)).toBeTruthy();
});

it(`should render a custom title and home label`, () => {
  const { getByText } = render(
    <MemoryRouter>
      <NotFoundPage title="עמוד לא זמין" homeLabel="חזרה" />
    </MemoryRouter>
  );

  expect(getByText(`עמוד לא זמין`)).toBeTruthy();
  expect(getByText(`חזרה`)).toBeTruthy();
});

it(`should call onNavigateHome when the home button is clicked`, () => {
  let called = false;
  const { container } = render(
    <MemoryRouter>
      <NotFoundPage onNavigateHome={() => { called = true; }} />
    </MemoryRouter>
  );

  const button = container.querySelector(`button`) as HTMLButtonElement;
  fireEvent.click(button);

  expect(called).toBe(true);
});

it(`should render the page root class name`, () => {
  const { container } = render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

  const root = container.querySelector(`.${styles.notFoundPage}`);
  expect(root).toBeTruthy();
});
