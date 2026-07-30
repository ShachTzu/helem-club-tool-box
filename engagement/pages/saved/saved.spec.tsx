import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Saved } from './saved.js';
import { mockSavedItems } from './saved.mock.js';
import styles from './saved.module.scss';

describe(`Saved`, () => {
  it(`renders the saved items list with titles`, () => {
    const { container } = render(
      <MockProvider>
        <Saved mockOptions={{ mockDeviceId: `device-test`, mockSavedItems: mockSavedItems() }} />
      </MockProvider>
    );

    const cardTitles = container.querySelectorAll(`.${styles.cardTitle}`);
    expect(cardTitles.length).toBe(3);
  });

  it(`renders the empty state when there are no saved items`, () => {
    const { container, getByText } = render(
      <MockProvider>
        <Saved mockOptions={{ mockDeviceId: `device-test`, mockSavedItems: [] }} />
      </MockProvider>
    );

    expect(container.querySelectorAll(`.${styles.card}`).length).toBe(0);
    expect(getByText(`עדיין לא שמרתם תוכן`)).toBeTruthy();
  });

  it(`removes an item from the list when its unsave button is clicked`, () => {
    const { container } = render(
      <MockProvider>
        <Saved mockOptions={{ mockDeviceId: `device-test`, mockSavedItems: mockSavedItems() }} />
      </MockProvider>
    );

    const unsaveButtons = container.querySelectorAll(`.${styles.unsaveButton}`);
    expect(unsaveButtons.length).toBe(3);

    fireEvent.click(unsaveButtons[0] as HTMLButtonElement);

    const remainingButtons = container.querySelectorAll(`.${styles.unsaveButton}`);
    expect(remainingButtons.length).toBe(2);
  });

  it(`renders the provided title and subtitle`, () => {
    const { getByText } = render(
      <MockProvider>
        <Saved
          title="הרשימה שלי"
          subtitle="תיאור מותאם אישית"
          mockOptions={{ mockDeviceId: `device-test`, mockSavedItems: [] }}
        />
      </MockProvider>
    );

    expect(getByText(`הרשימה שלי`)).toBeTruthy();
    expect(getByText(`תיאור מותאם אישית`)).toBeTruthy();
  });
});
