import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { mockSearchResults } from '@helemclub/platform.entities.search-result';
import { Header } from './header.js';
import styles from './header.module.scss';

describe(`Header`, () => {
  it(`renders the default navigation items`, () => {
    const { getAllByText } = render(
      <MockProvider>
        <Header mockUser={null} mockSearchResults={mockSearchResults()} />
      </MockProvider>
    );

    expect(getAllByText(`חוכמת הקהילה`).length).toBeGreaterThan(0);
    expect(getAllByText(`ארגז כלים`).length).toBeGreaterThan(0);
  });

  it(`renders custom navigation items when provided`, () => {
    const { getAllByText, queryAllByText } = render(
      <MockProvider>
        <Header
          mockUser={null}
          mockSearchResults={mockSearchResults()}
          navigationItems={[{ label: `דף מותאם אישית`, path: `/custom` }]}
        />
      </MockProvider>
    );

    expect(getAllByText(`דף מותאם אישית`).length).toBeGreaterThan(0);
    expect(queryAllByText(`ארגז כלים`).length).toBe(0);
  });

  it(`renders login and signup actions for anonymous users`, () => {
    const { getAllByText } = render(
      <MockProvider>
        <Header mockUser={null} mockSearchResults={mockSearchResults()} />
      </MockProvider>
    );

    expect(getAllByText(`התחברות`).length).toBeGreaterThan(0);
  });

  it(`renders the display name for an authenticated user`, () => {
    const user = mockUser({ displayName: `נועה כהן` }).toObject();

    const { getAllByText } = render(
      <MockProvider>
        <Header mockUser={user} mockSearchResults={mockSearchResults()} />
      </MockProvider>
    );

    expect(getAllByText(`נועה כהן`).length).toBeGreaterThan(0);
  });

  it(`opens the mobile drawer when the hamburger button is clicked`, () => {
    const { container } = render(
      <MockProvider>
        <Header mockUser={null} mockSearchResults={mockSearchResults()} />
      </MockProvider>
    );

    const hamburgerButton = container.querySelector(`.${styles.hamburgerButton}`) as HTMLButtonElement;
    fireEvent.click(hamburgerButton);

    const drawerOverlay = container.querySelector(`.${styles.drawerOverlay}`);
    expect(drawerOverlay?.classList.contains(styles.drawerOverlayOpen)).toBe(true);
  });

  it(`closes the mobile drawer when the close button is clicked`, () => {
    const { container } = render(
      <MockProvider>
        <Header mockUser={null} mockSearchResults={mockSearchResults()} />
      </MockProvider>
    );

    const hamburgerButton = container.querySelector(`.${styles.hamburgerButton}`) as HTMLButtonElement;
    fireEvent.click(hamburgerButton);

    const closeButton = container.querySelector(`.${styles.drawerCloseButton}`) as HTMLButtonElement;
    fireEvent.click(closeButton);

    const drawerOverlay = container.querySelector(`.${styles.drawerOverlay}`);
    expect(drawerOverlay?.classList.contains(styles.drawerOverlayOpen)).toBe(false);
  });

  it(`renders registered header actions`, () => {
    const { getByText } = render(
      <MockProvider>
        <Header
          mockUser={null}
          mockSearchResults={mockSearchResults()}
          headerActions={[{ id: `custom-action`, component: () => <span>פעולה מותאמת</span> }]}
        />
      </MockProvider>
    );

    expect(getByText(`פעולה מותאמת`)).toBeTruthy();
  });

  it(`applies a custom class name to the root element`, () => {
    const { container } = render(
      <MockProvider>
        <Header mockUser={null} mockSearchResults={mockSearchResults()} className="custom-header" />
      </MockProvider>
    );

    const root = container.querySelector(`.${styles.header}`);
    expect(root?.classList.contains(`custom-header`)).toBe(true);
  });
});
