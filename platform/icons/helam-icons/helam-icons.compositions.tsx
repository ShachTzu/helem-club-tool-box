import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon } from './home-icon.js';
import { SearchIcon } from './search-icon.js';
import { MenuIcon } from './menu-icon.js';
import { UserIcon } from './user-icon.js';
import { LogoutIcon } from './logout-icon.js';
import { AdminIcon } from './admin-icon.js';
import { BookmarkIcon } from './bookmark-icon.js';
import { BellIcon } from './bell-icon.js';
import { ChevronIcon } from './chevron-icon.js';
import { CloseIcon } from './close-icon.js';
import { ToolboxIcon } from './toolbox-icon.js';
import { LibraryIcon } from './library-icon.js';
import { BlogIcon } from './blog-icon.js';
import { EventsIcon } from './events-icon.js';
import { GalleryIcon } from './gallery-icon.js';
import { DomainsIcon } from './domains-icon.js';

export const CoreNavigationIcons = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <IconTile label="בית">
          <HomeIcon color="primary" size="large" title="בית" />
        </IconTile>
        <IconTile label="חיפוש">
          <SearchIcon color="primary" size="large" title="חיפוש" />
        </IconTile>
        <IconTile label="תפריט">
          <MenuIcon color="primary" size="large" title="תפריט" />
        </IconTile>
        <IconTile label="משתמש">
          <UserIcon color="primary" size="large" title="משתמש" />
        </IconTile>
        <IconTile label="התנתקות">
          <LogoutIcon color="primary" size="large" title="התנתקות" />
        </IconTile>
        <IconTile label="ניהול">
          <AdminIcon color="primary" size="large" title="ניהול" />
        </IconTile>
        <IconTile label="שמור">
          <BookmarkIcon color="accent" variant="fill" size="large" title="שמור" />
        </IconTile>
        <IconTile label="התראות">
          <BellIcon color="primary" size="large" title="התראות" />
        </IconTile>
        <IconTile label="סגירה">
          <CloseIcon color="primary" size="large" title="סגירה" />
        </IconTile>
      </div>
    </MemoryRouter>
  );
};

export const FeatureNavigationIcons = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <IconTile label="ארגז כלים">
          <ToolboxIcon color="secondary" size="large" title="ארגז כלים" />
        </IconTile>
        <IconTile label="ספריית הידע">
          <LibraryIcon color="secondary" size="large" title="ספריית הידע" />
        </IconTile>
        <IconTile label="בלוג">
          <BlogIcon color="secondary" size="large" title="בלוג" />
        </IconTile>
        <IconTile label="אירועים">
          <EventsIcon color="secondary" size="large" title="אירועים" />
        </IconTile>
        <IconTile label="גלריה">
          <GalleryIcon color="secondary" size="large" title="גלריה" />
        </IconTile>
        <IconTile label="דומיינים">
          <DomainsIcon color="secondary" size="large" title="דומיינים" />
        </IconTile>
      </div>
    </MemoryRouter>
  );
};

export const ChevronDirections = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 24 }}>
        <ChevronIcon direction="up" color="primary" title="למעלה" />
        <ChevronIcon direction="down" color="primary" title="למטה" />
        <ChevronIcon direction="left" color="primary" title="שמאלה" />
        <ChevronIcon direction="right" color="primary" title="ימינה" />
      </div>
    </MemoryRouter>
  );
};

function IconTile({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        background: 'var(--colors-surface-primary)',
        border: '1px solid var(--colors-border)',
        borderRadius: 'var(--borders-radius-medium)',
        padding: 16,
        minWidth: 88,
      }}
    >
      {children}
      <span style={{ fontSize: 12, color: 'var(--colors-text-secondary)' }}>{label}</span>
    </div>
  );
}
