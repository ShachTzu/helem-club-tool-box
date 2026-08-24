import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { AdminShell } from './admin-shell.js';
import type { AdminPanelItem } from './admin-panel-item-type.js';
import styles from './admin-shell.module.scss';

function TestPanelOne() {
  return <div>תוכן פאנל ראשון</div>;
}

function TestPanelTwo() {
  return <div>תוכן פאנל שני</div>;
}

const testPanels: AdminPanelItem[] = [
  { id: `first`, label: `פאנל ראשון`, path: `/admin/first`, component: TestPanelOne },
  { id: `second`, label: `פאנל שני`, path: `/admin/second`, component: TestPanelTwo },
];

it(`should render the admin shell title for an admin user`, () => {
  const admin = mockUser({ role: `admin` });
  const { container } = render(
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} panels={testPanels} />
    </MockProvider>
  );
  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`לוח בקרה`);
});

it(`should render the first panel by default`, () => {
  const admin = mockUser({ role: `admin` });
  const { getByText } = render(
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} panels={testPanels} />
    </MockProvider>
  );
  expect(getByText(`תוכן פאנל ראשון`)).toBeTruthy();
});

it(`should switch the active panel when a nav item is clicked`, () => {
  const admin = mockUser({ role: `admin` });
  const { container, getByText } = render(
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} panels={testPanels} />
    </MockProvider>
  );
  const navItems = container.querySelectorAll(`.${styles.navItem}`);
  fireEvent.click(navItems[1]);
  expect(getByText(`תוכן פאנל שני`)).toBeTruthy();
});

it(`should show a restricted message for a member user`, () => {
  const member = mockUser({ role: `member` });
  const { container } = render(
    <MockProvider>
      <AdminShell mockUser={member.toObject()} panels={testPanels} />
    </MockProvider>
  );
  const stateTitle = container.querySelector(`.${styles.stateTitle}`);
  expect(stateTitle?.textContent).toBe(`הגישה חסומה`);
});

it(`should render a count badge on a panel with pending items`, () => {
  const admin = mockUser({ role: `admin` });
  const panelsWithBadge: AdminPanelItem[] = [
    { ...testPanels[0], badgeCount: 3 },
    testPanels[1],
  ];
  const { container } = render(
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} panels={panelsWithBadge} />
    </MockProvider>
  );
  const badges = container.querySelectorAll(`.${styles.navBadge}`);
  expect(badges.length).toBe(1);
  expect(badges[0].textContent).toBe(`3`);
});

it(`should not render a badge when the count is zero`, () => {
  const admin = mockUser({ role: `admin` });
  const panelsWithZero: AdminPanelItem[] = [{ ...testPanels[0], badgeCount: 0 }];
  const { container } = render(
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} panels={panelsWithZero} />
    </MockProvider>
  );
  expect(container.querySelectorAll(`.${styles.navBadge}`).length).toBe(0);
});

it(`should hide panels restricted to admin role for a moderator user`, () => {
  const moderator = mockUser({ role: `moderator` });
  const restrictedPanels: AdminPanelItem[] = [
    ...testPanels,
    { id: `admin-only`, label: `אדמין בלבד`, path: `/admin/only`, component: TestPanelOne, roles: [`admin`] },
  ];
  const { container } = render(
    <MockProvider>
      <AdminShell mockUser={moderator.toObject()} panels={restrictedPanels} />
    </MockProvider>
  );
  const navItems = container.querySelectorAll(`.${styles.navItem}`);
  expect(navItems.length).toBe(2);
});
