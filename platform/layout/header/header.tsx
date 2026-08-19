import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import { Logo } from '@helemclub/design.content.logo';
import { Link } from '@helemclub/design.navigation.link';
import { UserBar } from '@helemclub/platform.composites.user-bar';
import type { UserBarProps, UserBarUserMenuItem } from '@helemclub/platform.composites.user-bar';
import { GlobalSearch } from '@helemclub/platform.ui.global-search';
import type { GlobalSearchProps } from '@helemclub/platform.ui.global-search';
import { HamburgerIcon } from './hamburger-icon.js';
import { DrawerCloseIcon } from './drawer-close-icon.js';
import type { HeaderNavigationItem } from './header-navigation-item-type.js';
import type { HeaderActionItem } from './header-action-item-type.js';
import styles from './header.module.scss';

const DEFAULT_NAVIGATION_ITEMS: HeaderNavigationItem[] = [
  { label: `בית`, path: `/` },
  { label: `חוכמת הקהילה`, path: `/wisdom` },
  { label: `ארגז כלים`, path: `/toolbox` },
  { label: `מאגר ידע`, path: `/knowledge` },

  // disabled for this lane — blog, events and gallery aspects are not
  // mounted (see platform/helam/helam.bit-app.ts); these would 404.
  // { label: `בלוג`, path: `/blog` },
  // { label: `אירועים`, path: `/events` },
  // { label: `גלריית PTSDART`, path: `/gallery` },
  { label: `תחומי התמודדות`, path: `/domains` },
];

const DEFAULT_HEADER_ACTIONS: HeaderActionItem[] = [];

const DEFAULT_USER_MENU_ITEMS: UserBarUserMenuItem[] = [];

export type HeaderProps = {
  /**
   * primary navigation items rendered in the desktop nav bar and the
   * mobile drawer menu. registered by feature aspects through the
   * platform's `NavigationItem` slot.
   */
  navigationItems?: HeaderNavigationItem[];

  /**
   * additional header actions rendered next to the search box and user bar.
   * registered by feature aspects through the platform's `HeaderAction` slot.
   */
  headerActions?: HeaderActionItem[];

  /**
   * user menu entries rendered inside the user bar dropdown for
   * authenticated users, registered through the platform's `UserMenuItem` slot.
   */
  userMenuItems?: UserBarUserMenuItem[];

  /**
   * the path considered currently active, used to highlight the matching
   * navigation item. defaults to the browser location when omitted.
   */
  activePath?: string;

  /**
   * provides mock data for the current user, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: UserBarProps[`mockUser`];

  /**
   * provides mock search results, bypassing the network request. useful
   * for tests and previews.
   */
  mockSearchResults?: GlobalSearchProps[`mockResults`];

  /**
   * called when a search result is selected, before navigating to its url.
   */
  onSearchResultSelect?: GlobalSearchProps[`onResultSelect`];

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
 * shared top header for the Helam Club platform (RTL). renders the brand
 * logo, primary navigation, global search, header actions and user bar.
 * collapses to a compact bar with a hamburger-triggered drawer menu on
 * mobile. sticky with a header shadow.
 */
export function Header({
  navigationItems = DEFAULT_NAVIGATION_ITEMS,
  headerActions = DEFAULT_HEADER_ACTIONS,
  userMenuItems = DEFAULT_USER_MENU_ITEMS,
  activePath,
  mockUser,
  mockSearchResults,
  onSearchResultSelect,
  className,
  style,
}: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (activePath === undefined) return false;
    return path === `/` ? activePath === `/` : activePath.startsWith(path);
  };

  return (
    <header className={classNames(styles.header, className)} style={style}>
      <div className={styles.bar}>
        <Logo href="/" size="medium" variant="dark" className={styles.logo} />

        <nav className={styles.desktopNav}>
          {navigationItems.map((item) => (
            <Link key={item.path} as={RouterLink} href={item.path} active={isActive(item.path)} inverse>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.searchSlot}>
          <GlobalSearch mockResults={mockSearchResults} onResultSelect={(result) => onSearchResultSelect?.(result)} />
        </div>

        <div className={styles.actions}>
          {headerActions.map((action) => {
            const ActionComponent = action.component;
            return <ActionComponent key={action.id} />;
          })}
          <UserBar mockUser={mockUser} userMenuItems={userMenuItems} className={styles.userBar} />
        </div>

        <button
          type="button"
          className={styles.hamburgerButton}
          aria-label="פתיחת תפריט"
          aria-expanded={isDrawerOpen}
          onClick={() => setIsDrawerOpen(true)}
        >
          <HamburgerIcon />
        </button>
      </div>

      <div
        className={classNames(styles.drawerOverlay, isDrawerOpen && styles.drawerOverlayOpen)}
        onClick={() => setIsDrawerOpen(false)}
      >
        <div className={styles.drawer} onClick={(event) => event.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <Logo href="/" size="medium" variant="dark" />
            <button
              type="button"
              className={styles.drawerCloseButton}
              aria-label="סגירת תפריט"
              onClick={() => setIsDrawerOpen(false)}
            >
              <DrawerCloseIcon />
            </button>
          </div>

          <div className={styles.drawerSearch}>
            <GlobalSearch
              mockResults={mockSearchResults}
              onResultSelect={(result) => {
                onSearchResultSelect?.(result);
                setIsDrawerOpen(false);
              }}
            />
          </div>

          <nav className={styles.drawerNav}>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                as={RouterLink}
                href={item.path}
                active={isActive(item.path)}
                inverse
                className={styles.drawerNavLink}
                onClick={() => setIsDrawerOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.drawerUserBar}>
            <UserBar mockUser={mockUser} userMenuItems={userMenuItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
