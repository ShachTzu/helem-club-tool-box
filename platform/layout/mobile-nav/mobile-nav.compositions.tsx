import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon, ToolboxIcon, LibraryIcon, BlogIcon, EventsIcon, DomainsIcon } from '@helemclub/platform.icons.helam-icons';
import { MobileNav } from './mobile-nav.js';
import type { MobileNavItem } from './mobile-nav-item-type.js';

export const BasicMobileNav = () => {
  return (
    <MemoryRouter initialEntries={[`/`]}>
      <div style={{ position: `relative`, height: 320, background: `var(--colors-surface-background)` }}>
        <p style={{ padding: 24 }}>עמוד הבית של הלם קלאב — התפריט התחתון מוצג בתחתית המסך.</p>
        <MobileNav />
      </div>
    </MemoryRouter>
  );
};

export const ActiveOnToolboxRoute = () => {
  return (
    <MemoryRouter initialEntries={[`/toolbox`]}>
      <div style={{ position: `relative`, height: 320, background: `var(--colors-surface-background)` }}>
        <p style={{ padding: 24 }}>עמוד ארגז הכלים — פריט &quot;כלים&quot; מודגש בענבר.</p>
        <MobileNav />
      </div>
    </MemoryRouter>
  );
};

const customItems: MobileNavItem[] = [
  { label: `בית`, path: `/`, icon: HomeIcon, order: 0 },
  { label: `כלים`, path: `/toolbox`, icon: ToolboxIcon, order: 1 },
  { label: `ידע`, path: `/knowledge`, icon: LibraryIcon, order: 2 },
  { label: `בלוג`, path: `/blog`, icon: BlogIcon, order: 3 },
  { label: `אירועים`, path: `/events`, icon: EventsIcon, order: 4 },
  { label: `דומיינים`, path: `/domains`, icon: DomainsIcon, order: 5 },
];

export const CustomNavigationItems = () => {
  return (
    <MemoryRouter initialEntries={[`/domains`]}>
      <div style={{ position: `relative`, height: 320, background: `var(--colors-surface-background)` }}>
        <p style={{ padding: 24 }}>תפריט מותאם עם פריט נוסף לתחומי התמודדות, נרשם דרך ה-slot.</p>
        <MobileNav items={customItems} />
      </div>
    </MemoryRouter>
  );
};
