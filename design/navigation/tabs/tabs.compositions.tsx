import React, { useState } from 'react';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Tabs } from './tabs.js';
import type { TabItem } from './tab-item-type.js';

const domainTabs: TabItem[] = [
  { key: `apps`, label: `🧰 כלים` },
  { key: `posts`, label: `📝 כתבות` },
  { key: `records`, label: `📚 מאגר ידע` },
  { key: `events`, label: `📅 אירועים` },
  { key: `gallery`, label: `🎨 גלריה` },
];

export const BasicTabs = () => {
  return (
    <HelamTheme>
      <div style={{ padding: 32 }}>
        <Tabs items={domainTabs} defaultActiveKey="apps" />
      </div>
    </HelamTheme>
  );
};

export const ControlledTabs = () => {
  const [activeKey, setActiveKey] = useState(`posts`);

  const content: Record<string, string> = {
    apps: `כלים שנבחרו ומדורגים על ידי קהילת הלם קלאב.`,
    posts: `כתבות מהבלוג של הלם קלאב בנושאי התמודדות.`,
    records: `הרצאות והדרכות ממאגר הידע הקהילתי.`,
    events: `אירועים קרובים ועבר של הקהילה.`,
    gallery: `יצירות מגלריית PTSDART.`,
  };

  return (
    <HelamTheme>
      <div style={{ padding: 32 }}>
        <Tabs items={domainTabs} activeKey={activeKey} onChange={(key) => setActiveKey(key)} />
        <p style={{ marginTop: 16, color: 'var(--colors-text-secondary)' }}>{content[activeKey]}</p>
      </div>
    </HelamTheme>
  );
};

export const ReviewTabs = () => {
  const reviewTabs: TabItem[] = [
    { key: `overview`, label: `סקירה` },
    { key: `reviews`, label: `דירוגים וביקורות` },
    { key: `gallery`, label: `גלריה` },
  ];

  return (
    <HelamTheme>
      <div style={{ padding: 32, maxWidth: 480 }}>
        <Tabs items={reviewTabs} defaultActiveKey="reviews" />
      </div>
    </HelamTheme>
  );
};
