import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { HomeIcon, ToolboxIcon, LibraryIcon, BlogIcon, EventsIcon } from '@helemclub/platform.icons.helam-icons';
import type { MobileNavItem } from './mobile-nav-item-type.js';
import styles from './mobile-nav.module.scss';

const DEFAULT_NAV_ITEMS: MobileNavItem[] = [
  { label: `בית`, path: `/`, icon: HomeIcon, order: 0 },
  { label: `כלים`, path: `/toolbox`, icon: ToolboxIcon, order: 1 },
  { label: `ידע`, path: `/knowledge`, icon: LibraryIcon, order: 2 },
  { label: `בלוג`, path: `/blog`, icon: BlogIcon, order: 3 },
  { label: `אירועים`, path: `/events`, icon: EventsIcon, order: 4 },
];

export type MobileNavProps = {
  /**
   * primary navigation items rendered in the bar, typically collected
   * from the platform's NavigationItem slot.
   */
  items?: MobileNavItem[];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * fixed bottom navigation bar for mobile / PWA (RTL). renders primary
 * navigation items with icons and labels, highlights the active item in
 * amber, and respects the device safe-area. hidden on desktop via CSS.
 */
export function MobileNav({ items = DEFAULT_NAV_ITEMS, className, style }: MobileNavProps) {
  const { pathname } = useLocation();
  const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const isActive = (path: string) => (path === `/` ? pathname === `/` : pathname.startsWith(path));

  return (
    <nav className={classNames(styles.mobileNav, className)} style={style}>
      {sortedItems.map((item) => {
        const active = isActive(item.path);
        const ItemIcon = item.icon;
        return (
          <RouterLink
            key={item.path}
            to={item.path}
            className={classNames(styles.navItem, active && styles.navItemActive)}
          >
            {ItemIcon && (
              <span className={styles.iconWrapper}>
                <ItemIcon size="medium" color={active ? `accent` : `current`} />
              </span>
            )}
            <span className={styles.label}>{item.label}</span>
          </RouterLink>
        );
      })}
    </nav>
  );
}
