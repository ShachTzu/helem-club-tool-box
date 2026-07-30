import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockApp } from '@helemclub/toolbox.entities.app';
import { AppEmbedBlock } from './app-embed-block.js';
import styles from './app-embed-block.module.scss';

describe('AppEmbedBlock', () => {
  it('renders the app name from provided app data', () => {
    const app = mockApp({ name: 'נשימה רגועה' }).toObject();

    const { container } = render(
      <MockProvider>
        <AppEmbedBlock app={app} />
      </MockProvider>
    );

    const nameElement = container.querySelector(`.${styles.name}`);
    expect(nameElement?.textContent).toBe('נשימה רגועה');
  });

  it('renders the call-to-action button pointing to the external link', () => {
    const app = mockApp({ externalLink: 'https://example.com/breathe' }).toObject();

    const { container } = render(
      <MockProvider>
        <AppEmbedBlock app={app} />
      </MockProvider>
    );

    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.com/breathe');
    expect(link?.textContent).toBe('לאפליקציה');
  });

  it('renders a no-rating message when the app has no ratings yet', () => {
    const app = mockApp({ avgRating: 0, ratingCount: 0 }).toObject();

    const { container } = render(
      <MockProvider>
        <AppEmbedBlock app={app} />
      </MockProvider>
    );

    const noRatingElement = container.querySelector(`.${styles.noRating}`);
    expect(noRatingElement?.textContent).toBe('אין עדיין דירוגים');
  });

  it('renders the app icon as an emoji when not a url', () => {
    const app = mockApp({ icon: '🫧' }).toObject();

    const { container } = render(
      <MockProvider>
        <AppEmbedBlock app={app} />
      </MockProvider>
    );

    const iconElement = container.querySelector(`.${styles.iconEmoji}`);
    expect(iconElement?.textContent).toBe('🫧');
  });
});
