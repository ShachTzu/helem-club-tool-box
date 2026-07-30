import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { PageLayout } from './page-layout.js';

const sectionStyle: React.CSSProperties = {
  background: 'var(--colors-surface-primary)',
  border: '1px solid var(--colors-border)',
  borderRadius: 'var(--borders-radius-medium)',
  boxShadow: 'var(--effects-shadows-card)',
  padding: 24,
};

export const BasicPageLayout = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <PageLayout>
          <div style={sectionStyle}>
            <h1 style={{ margin: 0, fontSize: 'var(--typography-sizes-heading-h1)', color: 'var(--colors-primary-default)' }}>
              תחומי התמודדות
            </h1>
            <p style={{ marginTop: 12, color: 'var(--colors-text-secondary)' }}>
              כל התכנים באקוסיסטם הלם קלאב, מאורגנים לפי תחומים — כלים, כתבות, אירועים ותכני מאגר ידע.
            </p>
          </div>
          <div style={sectionStyle}>
            <h2 style={{ margin: 0, fontSize: 'var(--typography-sizes-heading-h2)', color: 'var(--colors-primary-default)' }}>
              כלים מומלצים
            </h2>
            <p style={{ marginTop: 12, color: 'var(--colors-text-secondary)' }}>
              רשימת אפליקציות שנבחרו ודורגו על ידי הקהילה, עם תיאורים קצרים והפניה לכל אפליקציה.
            </p>
          </div>
        </PageLayout>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const CompactSpacing = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <PageLayout spacing="compact">
          <div style={sectionStyle}>
            <h2 style={{ margin: 0, fontSize: 'var(--typography-sizes-heading-h3)', color: 'var(--colors-primary-default)' }}>
              עדכון קצר
            </h2>
            <p style={{ marginTop: 8, color: 'var(--colors-text-secondary)' }}>
              דף עם תוכן צפוף יותר — מרווחים קטנים יותר בין הסקציות.
            </p>
          </div>
          <div style={sectionStyle}>
            <p style={{ margin: 0, color: 'var(--colors-text-secondary)' }}>
              מתאים לעמודי הגדרות או תוכן משני.
            </p>
          </div>
        </PageLayout>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const RelaxedSpacingAsSection = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <PageLayout spacing="relaxed" as="section">
          <div style={sectionStyle}>
            <h2 style={{ margin: 0, fontSize: 'var(--typography-sizes-heading-h2)', color: 'var(--colors-primary-default)' }}>
              חוכמת הקהילה
            </h2>
            <p style={{ marginTop: 12, color: 'var(--colors-text-secondary)' }}>
              מרווחים נדיבים בין סקציות עמוד ארוך ותוכן שיווקי, לנשימה ורוגע.
            </p>
          </div>
          <div style={sectionStyle}>
            <p style={{ margin: 0, color: 'var(--colors-text-secondary)' }}>
              נבנה כ-section סמנטי במקום main.
            </p>
          </div>
        </PageLayout>
      </HelamTheme>
    </MemoryRouter>
  );
};
