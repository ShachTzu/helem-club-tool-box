import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { HomeIcon, ToolboxIcon, LibraryIcon, BlogIcon, EventsIcon } from '@helemclub/platform.icons.helam-icons';
import type { MobileNavItem } from './mobile-nav-item-type.js';
import styles from './mobile-nav.module.scss';

/**
 * home is the platform's own entry, not a feature's — it is always present.
 */
const HOME_ITEM: MobileNavItem = { label: `בית`, path: `/`, icon: HomeIcon, order: 0 };

/**
 * the bottom bar has room for a handful of destinations, so it shows only the
 * features it has an icon and a short label for. a feature appears here only
 * when its aspect registered the matching navigation item, which means
 * switching a feature off removes it from the bar too.
 */
const MOBILE_ENTRIES: Record<string, { label: string; icon: MobileNavItem['icon']; order: number }> = {
  '/toolbox': { label: `כלים`, icon: ToolboxIcon, order: 1 },
  '/knowledge': { label: `ידע`, icon: LibraryIcon, order: 2 },
  '/blog': { label: `בלוג`, icon: BlogIcon, order: 3 },
  '/events': { label: `אירועים`, icon: EventsIcon, order: 4 },
};

/**
 * pick the bottom-bar entries that correspond to currently registered
 * navigation items, always led by home.
 */
function toMobileItems(navPaths: string[]): MobileNavItem[] {
  const featured = navPaths
    .filter((path) => MOBILE_ENTRIES[path])
    .map((path) => ({ path, ...MOBILE_ENTRIES[path] }));
  return [HOME_ITEM, ...featured];
}

export type MobileNavProps = {
  /**
   * primary navigation items rendered in the bar, typically collected
   * from the platform's NavigationItem slot.
   */
  items?: MobileNavItem[];

  /**
   * paths of the navigation items registered by the loaded feature aspects.
   * used to decide which bottom-bar entries to show when `items` is not given.
   */
  navigationPaths?: string[];

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
export function MobileNav({ items, navigationPaths = [], className, style }: MobileNavProps) {
  const { pathname } = useLocation();
  const resolved = items ?? toMobileItems(navigationPaths);
  const sortedItems = [...resolved].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
