import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import type { HomeDashboardPanel } from './home-dashboard-panel-type.js';
import { Home } from './home.js';
import styles from './home.module.scss';

function PanelA() {
  return <div>פאנל א</div>;
}

function PanelB() {
  return <div>פאנל ב</div>;
}

describe('Home', () => {
  it('does not render a personalized greeting for signed-out visitors', () => {
    const { container } = render(
      <MockProvider>
        <Home mockUser={null} />
      </MockProvider>
    );

    const greeting = container.querySelector(`.${styles.greetingCard}`);
    expect(greeting).toBeNull();
  });

  it('renders a personalized greeting with the display name for signed-in members', () => {
    const member = mockUser({ displayName: `נועה לוי`, role: `member` });
    const { container } = render(
      <MockProvider>
        <Home mockUser={member.toObject()} />
      </MockProvider>
    );

    const title = container.querySelector(`.${styles.greetingTitle}`);
    expect(title?.textContent).toContain(`נועה לוי`);
  });

  it('does not render dashboard panels for signed-out visitors even when provided', () => {
    const panels: HomeDashboardPanel[] = [{ id: `a`, component: PanelA }];
    const { container } = render(
      <MockProvider>
        <Home mockUser={null} dashboardPanels={panels} />
      </MockProvider>
    );

    const grid = container.querySelector(`.${styles.dashboardGrid}`);
    expect(grid).toBeNull();
  });

  it('renders registered dashboard panels above the marketing content for signed-in members', () => {
    const member = mockUser({ displayName: `דני כהן`, role: `member` });
    const panels: HomeDashboardPanel[] = [{ id: `a`, component: PanelA }];
    const { container, getByText } = render(
      <MockProvider>
        <Home mockUser={member.toObject()} dashboardPanels={panels} />
      </MockProvider>
    );

    const grid = container.querySelector(`.${styles.dashboardGrid}`);
    expect(grid).toBeTruthy();
    expect(getByText(`פאנל א`)).toBeTruthy();
  });

  it('orders dashboard panels according to the order field', () => {
    const member = mockUser({ displayName: `דני כהן`, role: `member` });
    const panels: HomeDashboardPanel[] = [
      { id: `b`, component: PanelB, order: 2 },
      { id: `a`, component: PanelA, order: 1 },
    ];
    const { container } = render(
      <MockProvider>
        <Home mockUser={member.toObject()} dashboardPanels={panels} />
      </MockProvider>
    );

    const grid = container.querySelector(`.${styles.dashboardGrid}`) as HTMLElement;
    const first = grid.children[0];
    expect(first.textContent).toBe(`פאנל א`);
  });
});
