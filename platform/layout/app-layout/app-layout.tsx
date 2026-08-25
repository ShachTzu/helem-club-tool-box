import React, { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Header, type HeaderProps } from '@helemclub/platform.layout.header';
import { Footer } from '@helemclub/platform.layout.footer';
import { MobileNav } from '@helemclub/platform.layout.mobile-nav';
import styles from './app-layout.module.scss';

export type AppLayoutProps = {
  /**
   * page content rendered between the header and the footer.
   */
  children?: ReactNode;

  /**
   * navigation items passed through to the header. registered by feature
   * aspects via the platform's NavigationItem slot.
   */
  navigationItems?: HeaderProps['navigationItems'];

  /**
   * header actions injected by feature aspects via the HeaderAction slot.
   */
  headerActions?: HeaderProps['headerActions'];

  /**
   * user menu entries rendered in the user bar dropdown.
   */
  userMenuItems?: HeaderProps['userMenuItems'];

  /**
   * provide a mock user for previews/tests (passed to the header user bar).
   */
  mockUser?: HeaderProps['mockUser'];

  /**
   * provide mock search results for previews/tests.
   */
  mockSearchResults?: HeaderProps['mockSearchResults'];

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
 * global application shell (RTL) for the Helam Club platform. composes the
 * sticky header, the routed page content, the site footer, and the fixed
 * mobile/PWA bottom navigation. registered as the platform layout wrapper so
 * every route renders inside it.
 */
export function AppLayout({
  children,
  navigationItems,
  headerActions,
  userMenuItems,
  mockUser,
  mockSearchResults,
  className,
  style,
}: AppLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className={classNames(styles.appLayout, className)} style={style}>
      <Header
        navigationItems={navigationItems}
        headerActions={headerActions}
        userMenuItems={userMenuItems}
        activePath={pathname}
        mockUser={mockUser}
        mockSearchResults={mockSearchResults}
      />

      <div className={styles.content}>{children}</div>

      <Footer />

      <MobileNav navigationPaths={(navigationItems || []).map((item) => item.path)} />
    </div>
  );
}
