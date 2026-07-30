import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { SectionLayout } from './section-layout.js';

const cardStyle: React.CSSProperties = {
  background: 'var(--colors-surface-primary)',
  border: '1px solid var(--colors-border)',
  borderRadius: 'var(--borders-radius-medium)',
  boxShadow: 'var(--effects-shadows-card)',
  padding: 20,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 16,
};

const PILLARS = [
  { icon: '🧰', title: 'ארגז כלים', desc: 'קטלוג אפליקציות התמודדות מדורג ומסונן.' },
  { icon: '📚', title: 'מאגר ידע', desc: 'סדרות וידאו, הקלטות והרצאות לפי נושא.' },
  { icon: '📝', title: 'בלוג', desc: 'ידע מקצועי ושיתופים אישיים מהקהילה.' },
  { icon: '📅', title: 'אירועים קהילתיים', desc: 'שולחנות עגולים, וובינרים ומפגשים.' },
];

export const BasicSectionLayout = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <SectionLayout title="האקוסיסטם" subtitle="חמישה רכיבים שנבנים על בסיס ידע מרכזי אחד">
          <div style={gridStyle}>
            {PILLARS.map((p) => (
              <div key={p.title} style={cardStyle}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{p.icon}</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: 'var(--colors-primary-default)' }}>
                  {p.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--colors-text-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </SectionLayout>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const WithEyebrowAndAction = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <SectionLayout
          eyebrow="מהבלוג"
          title="ידע מקצועי ושיתופים אישיים"
          subtitle="כתבות שנכתבו בשיתוף פסיכולוגים ואנשי מקצוע מהקהילה."
          action={
            <a href="/blog" style={{ color: 'var(--colors-secondary-default)', fontWeight: 700, textDecoration: 'none' }}>
              לכל הכתבות ←
            </a>
          }
        >
          <div style={gridStyle}>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: 'var(--colors-text-secondary)' }}>
                איך לזהות טריגרים ולהתמודד איתם ברגע האמת.
              </p>
            </div>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: 'var(--colors-text-secondary)' }}>
                הסיפור האישי שלי: הדרך חזרה לשגרה אחרי שנתיים.
              </p>
            </div>
          </div>
        </SectionLayout>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const CompactSectionWithoutHeader = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <SectionLayout spacing="compact">
          <div style={cardStyle}>
            <p style={{ margin: 0, color: 'var(--colors-text-secondary)' }}>
              סקציה ללא כותרת — מתאימה לתוכן חופשי בתוך עמוד ארוך.
            </p>
          </div>
        </SectionLayout>
      </HelamTheme>
    </MemoryRouter>
  );
};
