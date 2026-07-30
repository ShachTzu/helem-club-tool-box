import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Icon } from './icon.js';

const BOOKMARK_PATH = `M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z`;
const HEART_PATH = `M12 21s-7.5-4.6-10-9.1C.4 8.5 2 4.8 5.5 4.2c2-.3 3.8.6 4.9 2.2 1.1-1.6 2.9-2.5 4.9-2.2 3.5.6 5.1 4.3 3.5 7.7-2.5 4.5-10 9.1-10 9.1Z`;
const CALENDAR_PATH = `M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z`;

export const IconSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
        <Icon path={BOOKMARK_PATH} size="small" color="primary" title="שמור - קטן" />
        <Icon path={BOOKMARK_PATH} size="medium" color="primary" title="שמור - בינוני" />
        <Icon path={BOOKMARK_PATH} size="large" color="primary" title="שמור - גדול" />
        <Icon path={BOOKMARK_PATH} size={48} color="primary" title="שמור - מותאם אישית" />
      </div>
    </MemoryRouter>
  );
};

export const IconColors = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <Icon path={HEART_PATH} color="primary" title="לב - ראשי" />
        <Icon path={HEART_PATH} color="secondary" title="לב - משני" />
        <Icon path={HEART_PATH} color="accent" title="לב - הדגשה" />
        <Icon path={HEART_PATH} color="muted" title="לב - מעומעם" />
        <div style={{ background: 'var(--colors-primary-default)', padding: 8, borderRadius: 'var(--borders-radius-medium)' }}>
          <Icon path={HEART_PATH} color="inverse" title="לב - הפוך" />
        </div>
      </div>
    </MemoryRouter>
  );
};

export const IconVariants = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
        <Icon path={CALENDAR_PATH} variant="stroke" size="large" color="primary" title="לוח שנה - קווי מתאר" />
        <Icon path={HEART_PATH} variant="fill" size="large" color="accent" title="לב - מלא" />
      </div>
    </MemoryRouter>
  );
};
