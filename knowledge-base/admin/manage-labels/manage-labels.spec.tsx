import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageLabels } from './manage-labels.js';
import { mockManageLabelsLabels } from './manage-labels.mock.js';
import styles from './manage-labels.module.scss';

it('renders a row for each provided label', () => {
  const { container } = render(
    <MockProvider>
      <ManageLabels mockLabels={mockManageLabelsLabels} />
    </MockProvider>
  );

  const table = container.querySelector(`table`);
  const nameCells = table?.querySelectorAll(`.${styles.nameCellName}`);
  expect(nameCells).toHaveLength(mockManageLabelsLabels.length);
});

it('renders the empty message when there are no labels', () => {
  const { getByText } = render(
    <MockProvider>
      <ManageLabels mockLabels={[]} />
    </MockProvider>
  );

  expect(getByText(`לא נמצאו תוויות במאגר הידע`)).toBeTruthy();
});

it('opens the creation form when clicking the new label button', () => {
  const { getByText, container } = render(
    <MockProvider>
      <ManageLabels mockLabels={mockManageLabelsLabels} />
    </MockProvider>
  );

  fireEvent.click(getByText(`+ תווית חדשה`));

  const formCard = container.querySelector(`.${styles.formCard}`);
  expect(formCard).not.toBeNull();
  expect(getByText(`יצירת תווית חדשה`)).toBeTruthy();
});

it('shows a validation error when submitting the form without a name', () => {
  const { getByText, container } = render(
    <MockProvider>
      <ManageLabels mockLabels={mockManageLabelsLabels} />
    </MockProvider>
  );

  fireEvent.click(getByText(`+ תווית חדשה`));
  fireEvent.click(getByText(`יצירת תווית`));

  const errorMessage = container.querySelector(`.${styles.formError}`);
  expect(errorMessage).not.toBeNull();
  expect(errorMessage?.textContent).toBe(`יש להזין שם לפרויקט`);
});

it('opens the edit form pre-filled with the selected label values', () => {
  const { getAllByText, container, getByText } = render(
    <MockProvider>
      <ManageLabels mockLabels={mockManageLabelsLabels} />
    </MockProvider>
  );

  const editButtons = getAllByText(`עריכה`);
  fireEvent.click(editButtons[0]);

  expect(getByText(`עריכת תווית`)).toBeTruthy();
  const nameInput = container.querySelector(`input[placeholder="לדוגמה: עזרה ראשונה"]`) as HTMLInputElement;
  expect(nameInput.value).toBe(mockManageLabelsLabels[0].name);
});

it('closes the form when clicking cancel', () => {
  const { getByText, container } = render(
    <MockProvider>
      <ManageLabels mockLabels={mockManageLabelsLabels} />
    </MockProvider>
  );

  fireEvent.click(getByText(`+ תווית חדשה`));
  expect(container.querySelector(`.${styles.formCard}`)).not.toBeNull();

  fireEvent.click(getByText(`ביטול`));
  expect(container.querySelector(`.${styles.formCard}`)).toBeNull();
});
