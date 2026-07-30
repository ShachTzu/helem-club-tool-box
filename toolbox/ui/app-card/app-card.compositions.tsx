import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { AppCard } from './app-card.js';

export const BasicAppCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 340 }}>
        <AppCard />
      </div>
    </MockProvider>
  );
};

export const AppCardGrid = () => {
  const apps = [
    {
      icon: `🫧`,
      name: `נשימה רגועה`,
      subtitle: `תרגילי נשימה מודרכים להרגעה מיידית`,
      avgRating: 4.7,
      ratingCount: 96,
      clickCount: 1240,
      isFeatured: true,
      href: `/toolbox/breathe-calm`,
      domains: [
        { id: `mindfulness-breathing`, slug: `mindfulness-breathing`, name: `מיינדפולנס ונשימות` },
        { id: `anxiety`, slug: `anxiety`, name: `חרדה` },
      ],
    },
    {
      icon: `🌙`,
      name: `עוגן לילה`,
      subtitle: `סיפורי הרדמה ונופי סאונד לשינה עמוקה`,
      avgRating: 4.3,
      ratingCount: 58,
      clickCount: 870,
      isFeatured: false,
      href: `/toolbox/sleep-anchor`,
      domains: [
        { id: `sleep`, slug: `sleep`, name: `שינה` },
        { id: `anxiety`, slug: `anxiety`, name: `חרדה` },
      ],
    },
    {
      icon: `🪨`,
      name: `קרקוע`,
      subtitle: `כלים להתמודדות עם טריגרים ופלאשבקים`,
      avgRating: 4.9,
      ratingCount: 143,
      clickCount: 1520,
      isFeatured: true,
      href: `/toolbox/ground-me`,
      domains: [
        { id: `triggers`, slug: `triggers`, name: `טריגרים` },
        { id: `emotional-regulation`, slug: `emotional-regulation`, name: `ויסות רגשי` },
      ],
    },
  ];

  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {apps.map((app) => (
          <AppCard key={app.href} {...app} />
        ))}
      </div>
    </MockProvider>
  );
};

export const AppCardWithoutReviews = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 340 }}>
        <AppCard
          icon="📓"
          name="מצב רוח"
          subtitle="יומן רגשי פשוט למעקב וויסות"
          avgRating={0}
          ratingCount={0}
          clickCount={640}
          isFeatured={false}
          href="/toolbox/mood-map"
          domains={[
            { id: `emotional-regulation`, slug: `emotional-regulation`, name: `ויסות רגשי` },
            { id: `depression`, slug: `depression`, name: `דיכאון ותחושת תקיעות` },
          ]}
        />
      </div>
    </MockProvider>
  );
};
