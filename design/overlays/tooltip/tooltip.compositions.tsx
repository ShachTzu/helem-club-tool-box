import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Tooltip } from './tooltip.js';

export const IconButtonTooltip = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ display: 'flex', gap: 24, padding: 80 }}>
          <Tooltip content="שמירה לקריאה מאוחרת" placement="top">
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: '1px solid var(--colors-border)',
                background: 'var(--colors-surface-primary)',
                color: 'var(--colors-text-primary)',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              🔖
            </button>
          </Tooltip>
          <Tooltip content="ערוך את הפרופיל שלך" placement="bottom">
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: '1px solid var(--colors-border)',
                background: 'var(--colors-surface-primary)',
                color: 'var(--colors-text-primary)',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✏️
            </button>
          </Tooltip>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const DashboardMetricTooltip = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ display: 'flex', gap: 20, padding: 80, flexWrap: 'wrap' }}>
          <Tooltip content="מספר המבקרים הייחודיים בחודש האחרון" placement="top">
            <div
              style={{
                background: 'var(--colors-surface-primary)',
                border: '1px solid var(--colors-border)',
                borderRadius: 'var(--borders-radius-medium)',
                padding: '20px 28px',
                textAlign: 'center',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--colors-primary-default)' }}>1,248</div>
              <div style={{ fontSize: 13, color: 'var(--colors-text-secondary)', marginTop: 4 }}>מבקרים החודש</div>
            </div>
          </Tooltip>
          <Tooltip content="כתבות שאושרו ופורסמו החודש" placement="top">
            <div
              style={{
                background: 'var(--colors-surface-primary)',
                border: '1px solid var(--colors-border)',
                borderRadius: 'var(--borders-radius-medium)',
                padding: '20px 28px',
                textAlign: 'center',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--colors-primary-default)' }}>86</div>
              <div style={{ fontSize: 13, color: 'var(--colors-text-secondary)', marginTop: 4 }}>כתבות שפורסמו</div>
            </div>
          </Tooltip>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const SidePlacementTooltip = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ display: 'flex', gap: 60, padding: 80 }}>
          <Tooltip content="פתח תפריט צד" placement="start">
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: '1px solid var(--colors-border)',
                background: 'var(--colors-surface-primary)',
                color: 'var(--colors-text-primary)',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ☰
            </button>
          </Tooltip>
          <Tooltip content="הגדרות חשבון" placement="end">
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: '1px solid var(--colors-border)',
                background: 'var(--colors-surface-primary)',
                color: 'var(--colors-text-primary)',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ⚙️
            </button>
          </Tooltip>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
