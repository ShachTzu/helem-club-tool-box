import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Card } from './card.js';

export const BasicCard = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 360 }}>
          <Card>
            <h3 style={{ margin: 0, color: 'var(--colors-primary-default)' }}>קהילת יזמים</h3>
            <p style={{ marginTop: 8, color: 'var(--colors-text-secondary)' }}>
              דומיין תוכן לחברי קהילת הלם קלאב, הכולל כלים, מדריכים ואירועים.
            </p>
          </Card>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const ClickableCard = () => {
  const [clicks, setClicks] = React.useState(0);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 360 }}>
          <Card clickable onClick={() => setClicks((prev) => prev + 1)}>
            <h3 style={{ margin: 0, color: 'var(--colors-primary-default)' }}>ארגז כלים</h3>
            <p style={{ marginTop: 8, color: 'var(--colors-text-secondary)' }}>
              לחצו כדי לפתוח את אוסף הכלים המומלצים על ידי הקהילה.
            </p>
            <span style={{ fontSize: 12.5, color: 'var(--colors-text-muted)' }}>מספר לחיצות: {clicks}</span>
          </Card>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const CardPaddingVariants = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Card padding="small" style={{ width: 200 }}>
            <span>ריפוד קטן</span>
          </Card>
          <Card padding="medium" style={{ width: 200 }}>
            <span>ריפוד בינוני</span>
          </Card>
          <Card padding="large" style={{ width: 200 }}>
            <span>ריפוד גדול</span>
          </Card>
          <Card padding="none" style={{ width: 200 }}>
            <div style={{ padding: 12, background: 'var(--colors-surface-secondary)' }}>ללא ריפוד</div>
          </Card>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
