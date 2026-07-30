import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockApp } from '@helemclub/toolbox.entities.app';
import { AppEmbedBlock } from './app-embed-block.js';

export const BasicAppEmbedBlock = () => {
  const app = mockApp().toObject();

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppEmbedBlock app={app} />
      </div>
    </MockProvider>
  );
};

export const AppEmbedBlockWithoutRatings = () => {
  const app = mockApp({
    id: 'focus-work',
    name: 'מיקוד',
    icon: '🎯',
    avgRating: 0,
    ratingCount: 0,
    externalLink: 'https://example.com/focus',
  }).toObject();

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppEmbedBlock app={app} />
      </div>
    </MockProvider>
  );
};

export const AppEmbedBlockInBlogContext = () => {
  const app = mockApp({
    id: 'ground-me',
    name: 'קרקוע',
    subtitle: 'כלים להתמודדות עם טריגרים ופלאשבקים',
    icon: '🪨',
    avgRating: 4.9,
    ratingCount: 143,
    externalLink: 'https://example.com/ground',
  }).toObject();

  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-primary)' }}>
          מתוך רשומת הבלוג: כלים מומלצים להתמודדות עם רגעי הצפה. אחד הכלים האהובים על הקהילה הוא:
        </p>
        <AppEmbedBlock app={app} source="blog" />
      </div>
    </MockProvider>
  );
};
