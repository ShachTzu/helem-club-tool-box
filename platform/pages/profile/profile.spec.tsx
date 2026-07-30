import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Profile } from './profile.js';
import { mockProfileUser } from './profile.mock.js';
import styles from './profile.module.scss';

it(`should render the current user's display name and email`, () => {
  const { container } = render(
    <MockProvider>
      <Profile mockUser={mockProfileUser} />
    </MockProvider>
  );

  const name = container.querySelector(`.${styles.name}`);
  const email = container.querySelector(`.${styles.email}`);
  expect(name?.textContent).toBe(mockProfileUser.displayName);
  expect(email?.textContent).toBe(mockProfileUser.email);
});

it(`should render the role badge with the Hebrew role label`, () => {
  const { container } = render(
    <MockProvider>
      <Profile mockUser={mockProfileUser} />
    </MockProvider>
  );

  const badge = container.querySelector(`.${styles.roleBadge}`);
  expect(badge?.textContent).toBe(`כותב`);
});

it(`should update the display name input when typing`, () => {
  const { container } = render(
    <MockProvider>
      <Profile mockUser={mockProfileUser} />
    </MockProvider>
  );

  const input = container.querySelectorAll(`input`)[0] as HTMLInputElement;
  fireEvent.change(input, { target: { value: `שם חדש` } });
  expect(input.value).toBe(`שם חדש`);
});

it(`should call onSave with the updated display name when saving`, async () => {
  const onSave = vi.fn().mockResolvedValue(true);
  const { container } = render(
    <MockProvider>
      <Profile mockUser={mockProfileUser} onSave={onSave} />
    </MockProvider>
  );

  const input = container.querySelectorAll(`input`)[0] as HTMLInputElement;
  fireEvent.change(input, { target: { value: `שם מעודכן` } });

  const buttons = container.querySelectorAll(`button`);
  const saveButton = Array.from(buttons).find((button) => button.textContent === `שמירת שינויים`);
  expect(saveButton).toBeTruthy();

  fireEvent.click(saveButton as HTMLButtonElement);
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(onSave).toHaveBeenCalledWith({ displayName: `שם מעודכן`, avatarUrl: mockProfileUser.avatarUrl });
});

it(`should render a sign-out button`, () => {
  const { container } = render(
    <MockProvider>
      <Profile mockUser={mockProfileUser} />
    </MockProvider>
  );

  const buttons = container.querySelectorAll(`button`);
  const signOutButton = Array.from(buttons).find((button) => button.textContent === `התנתקות`);
  expect(signOutButton).toBeTruthy();
});

it(`should redirect signed-out visitors instead of rendering the profile card`, () => {
  const { container } = render(
    <MockProvider>
      <Profile mockUser={null} />
    </MockProvider>
  );

  const name = container.querySelector(`.${styles.name}`);
  expect(name).toBeNull();
});
