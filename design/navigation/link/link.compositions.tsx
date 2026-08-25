import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Link } from './link.js';

export const BasicLink = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 20 }}>
        <Link href="/domains">תחומי התמודדות</Link>
        <Link href="/knowledge">ספריית הידע</Link>
        <Link href="/blog">בלוג</Link>
      </div>
    </MockProvider>
  );
};

export const ActiveAndExternalLinks = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Link href="/toolbox" active>
          ארגז כלים
        </Link>
        <Link href="/events">אירועים</Link>
        <Link href="https://facebook.com">עמוד הפייסבוק שלנו</Link>
      </div>
    </MockProvider>
  );
};

export const InverseLinksOnDarkSurface = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          background: 'var(--colors-primary-default)',
          display: 'flex',
          gap: 20,
          borderRadius: 'var(--borders-radius-medium)',
        }}
      >
        <Link href="/" inverse active>
          בית
        </Link>
        <Link href="/wisdom" inverse>
          חוכמת הקהילה
        </Link>
        <Link href="/gallery" inverse>
          גלריית PTSDART
        </Link>
      </div>
    </MockProvider>
  );
};

export const RouterAwareLink = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 20 }}>
        <Link as={RouterLink} href="/domains" active>
          תחומי התמודדות
        </Link>
        <Link as={RouterLink} href="/saved">
          שמורים שלי
        </Link>
      </div>
    </MockProvider>
  );
};
