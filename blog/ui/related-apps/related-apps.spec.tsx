import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { RelatedApps } from './related-apps.js';
import styles from './related-apps.module.scss';

describe('RelatedApps', () => {
  it('should render apps that share a domain with the post', () => {
    const { container } = render(
      <MockProvider>
        <RelatedApps domains={[`מיינדפולנס ונשימות`]} mockApps={mockAppsData()} />
      </MockProvider>
    );

    const grid = container.querySelector(`.${styles.grid}`);
    expect(grid?.children.length).toBeGreaterThan(0);
  });

  it('should limit the number of rendered apps to maxApps', () => {
    const { container } = render(
      <MockProvider>
        <RelatedApps domains={[`חרדה`]} maxApps={1} mockApps={mockAppsData()} />
      </MockProvider>
    );

    const grid = container.querySelector(`.${styles.grid}`);
    expect(grid?.children.length).toBe(1);
  });

  it('should render nothing when no apps share a domain with the post', () => {
    const { container } = render(
      <MockProvider>
        <RelatedApps domains={[`תחום שאינו קיים`]} mockApps={mockAppsData()} />
      </MockProvider>
    );

    const section = container.querySelector(`.${styles.relatedApps}`);
    expect(section).toBeNull();
  });

  it('should render the provided title', () => {
    const { getByText } = render(
      <MockProvider>
        <RelatedApps title="כלים שיכולים לעזור" domains={[`חרדה`]} mockApps={mockAppsData()} />
      </MockProvider>
    );

    expect(getByText('כלים שיכולים לעזור')).toBeTruthy();
  });
});
