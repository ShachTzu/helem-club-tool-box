import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { UserBar } from './user-bar.js';
import styles from './user-bar.module.scss';

describe(`UserBar`, () => {
  it(`renders login and signup actions for anonymous users`, () => {
    const { getByText } = render(
      <MockProvider>
        <UserBar mockUser={null} />
      </MockProvider>
    );

    expect(getByText(`התחברות`)).toBeTruthy();
    expect(getByText(`הרשמה`)).toBeTruthy();
  });

  it(`renders the display name for an authenticated user`, () => {
    const user = mockUser({ displayName: `נועה כהן` }).toObject();

    const { getByText } = render(
      <MockProvider>
        <UserBar mockUser={user} />
      </MockProvider>
    );

    expect(getByText(`נועה כהן`)).toBeTruthy();
  });

  it(`opens the dropdown menu and shows profile and saved items`, () => {
    const user = mockUser({ displayName: `נועה כהן` }).toObject();

    const { container, getByText } = render(
      <MockProvider>
        <UserBar mockUser={user} />
      </MockProvider>
    );

    const trigger = container.querySelector(`button`) as HTMLButtonElement;
    fireEvent.click(trigger);

    expect(getByText(`הפרופיל שלי`)).toBeTruthy();
    expect(getByText(`שמורים`)).toBeTruthy();
    expect(getByText(`התנתקות`)).toBeTruthy();
  });

  it(`shows the admin menu item only for moderators and admins`, () => {
    const member = mockUser({ displayName: `חבר רגיל`, role: `member` }).toObject();

    const { container, queryByText } = render(
      <MockProvider>
        <UserBar mockUser={member} />
      </MockProvider>
    );

    const trigger = container.querySelector(`button`) as HTMLButtonElement;
    fireEvent.click(trigger);

    expect(queryByText(`אזור ניהול`)).toBeNull();
  });

  it(`renders registered user menu items for authenticated users`, () => {
    const user = mockUser({ displayName: `כותבת תוכן`, role: `writer` }).toObject();

    const { container, getByText } = render(
      <MockProvider>
        <UserBar
          mockUser={user}
          userMenuItems={[{ label: `הכלים שהגשתי`, path: `/toolbox/my-submissions` }]}
        />
      </MockProvider>
    );

    const trigger = container.querySelector(`button`) as HTMLButtonElement;
    fireEvent.click(trigger);

    expect(getByText(`הכלים שהגשתי`)).toBeTruthy();
  });

  it(`applies a custom class name to the root element`, () => {
    const { container } = render(
      <MockProvider>
        <UserBar mockUser={null} className="custom-user-bar" />
      </MockProvider>
    );

    const root = container.querySelector(`.${styles.userBar}`);
    expect(root?.classList.contains(`custom-user-bar`)).toBe(true);
  });
});
