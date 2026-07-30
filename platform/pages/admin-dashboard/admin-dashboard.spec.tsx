import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { AdminDashboard } from './admin-dashboard.js';
import styles from './admin-dashboard.module.scss';

describe('AdminDashboard', () => {
  it('renders the overview metrics for an admin user', () => {
    const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
    const { container } = render(
      <MockProvider>
        <AdminDashboard mockUser={admin.toObject()} />
      </MockProvider>
    );

    const metricCards = container.querySelectorAll(`.${styles.metricCard}`);
    expect(metricCards.length).toBeGreaterThan(0);
  });

  it('renders custom metrics when provided', () => {
    const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
    const { container } = render(
      <MockProvider>
        <AdminDashboard
          mockUser={admin.toObject()}
          metrics={[{ id: `custom`, label: `מדד מותאם`, value: `99` }]}
        />
      </MockProvider>
    );

    const metricLabels = container.querySelectorAll(`.${styles.metricLabel}`);
    expect(metricLabels.length).toBe(1);
    expect(metricLabels[0].textContent).toBe(`מדד מותאם`);
  });

  it('blocks access for a signed-in member without moderator privileges', () => {
    const member = mockUser({ displayName: `שם דו`, role: `member` });
    const { container } = render(
      <MockProvider>
        <AdminDashboard mockUser={member.toObject()} />
      </MockProvider>
    );

    const metricCards = container.querySelectorAll(`.${styles.metricCard}`);
    expect(metricCards.length).toBe(0);
  });
});
