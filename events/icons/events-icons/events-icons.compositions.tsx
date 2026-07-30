import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarIcon, WebinarIcon, LocationIcon, RsvpIcon } from './events-icons.js';

export const EventsIconsGallery = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          gap: 32,
          alignItems: 'center',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <CalendarIcon size="large" color="primary" />
          <span style={{ fontSize: 13, color: 'var(--colors-text-secondary)' }}>לוח שנה</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <WebinarIcon size="large" color="primary" />
          <span style={{ fontSize: 13, color: 'var(--colors-text-secondary)' }}>וובינר</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <LocationIcon size="large" color="primary" />
          <span style={{ fontSize: 13, color: 'var(--colors-text-secondary)' }}>מיקום</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <RsvpIcon size="large" color="primary" />
          <span style={{ fontSize: 13, color: 'var(--colors-text-secondary)' }}>אישור הגעה</span>
        </div>
      </div>
    </MemoryRouter>
  );
};

export const EventsIconsColors = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 24 }}>
        <CalendarIcon color="primary" />
        <CalendarIcon color="secondary" />
        <CalendarIcon color="accent" />
        <CalendarIcon color="muted" />
        <div style={{ background: 'var(--colors-primary-default)', padding: 8, borderRadius: 'var(--borders-radius-medium)' }}>
          <CalendarIcon color="inverse" />
        </div>
      </div>
    </MemoryRouter>
  );
};

export const EventsIconsInEventCard = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          maxWidth: 320,
          background: 'var(--colors-surface-primary)',
          border: '1px solid var(--colors-border)',
          borderRadius: 'var(--borders-radius-medium)',
          boxShadow: 'var(--effects-shadows-card)',
          padding: 18,
        }}
      >
        <h3 style={{ margin: '0 0 12px', color: 'var(--colors-primary-default)', fontSize: 18 }}>
          שולחן עגול: התמודדות והחלמה
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--colors-secondary-default)', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarIcon size="small" color="secondary" />
            יום שלישי, 12.3 · 18:00
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <WebinarIcon size="small" color="secondary" />
            מפגש מקוון בזום
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RsvpIcon size="small" color="accent" />
            32 נרשמו
          </span>
        </div>
      </div>
    </MemoryRouter>
  );
};
