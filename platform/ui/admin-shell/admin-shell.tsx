import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Tabs } from '@helemclub/design.navigation.tabs';
import { Badge } from '@helemclub/design.content.badge';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import type { PlainUser } from '@helemclub/platform.entities.user';
import type { AdminPanelItem, AdminShellUserRole } from './admin-panel-item-type.js';
import { DEFAULT_ADMIN_PANELS } from './default-admin-panels.js';
import styles from './admin-shell.module.scss';

const NAV_ICONS: Record<string, string> = {
  users: `👥`,
  toolbox: `🧰`,
  blog: `📝`,
  moderation: `🛡️`,
};

function panelIconFor(panelId: string) {
  return NAV_ICONS[panelId] || `🗂️`;
}

/**
 * whether a panel has outstanding items worth flagging. a count of zero is
 * treated as nothing to show, so panels with an empty queue stay quiet.
 */
function hasBadge(count?: number): count is number {
  return typeof count === `number` && count > 0;
}

/**
 * accessible suffix appended to a nav label when the panel has a queue, so
 * screen-reader users hear the count rather than only seeing it.
 */
function badgeLabelFor(count: number) {
  return `${count} פריטים בהמתנה`;
}

export type AdminShellProps = {
  /**
   * admin panels registered by feature aspects through the platform's
   * AdminPanel slot. each panel is rendered when selected from the
   * navigation.
   */
  panels?: AdminPanelItem[];

  /**
   * mock data for the current user, bypasses the auth hook. useful for
   * tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: PlainUser | null;

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
 * admin area shell (RTL). lists registered AdminPanel entries in a side
 * navigation (tabs on smaller screens) and renders the active panel.
 * restricted to users holding the moderator or admin role.
 */
export function AdminShell({
  panels = DEFAULT_ADMIN_PANELS,
  mockUser,
  className,
  style,
}: AdminShellProps) {
  const hasMockUser = mockUser !== undefined;
  const { user, loading, isModerator } = useAuth(hasMockUser ? { mockData: mockUser } : undefined);

  const visiblePanels = useMemo(() => {
    return panels.filter((panel) => {
      if (!panel.roles || panel.roles.length === 0) return true;
      if (!user) return false;
      return panel.roles.some((role) => user.isAtLeast(role as AdminShellUserRole));
    });
  }, [panels, user]);

  const [activeId, setActiveId] = useState<string>(visiblePanels[0]?.id || ``);
  const activePanelId = visiblePanels.some((panel) => panel.id === activeId)
    ? activeId
    : visiblePanels[0]?.id || ``;

  const activePanel = visiblePanels.find((panel) => panel.id === activePanelId);
  const ActivePanelComponent = activePanel?.component;

  // the tabs primitive renders plain text labels, so the count is appended
  // inline there rather than as a Badge element.
  const tabItems = useMemo(
    () =>
      visiblePanels.map((panel) => ({
        key: panel.id,
        label: hasBadge(panel.badgeCount)
          ? `${panelIconFor(panel.id)} ${panel.label} (${panel.badgeCount})`
          : `${panelIconFor(panel.id)} ${panel.label}`,
      })),
    [visiblePanels]
  );

  if (loading) {
    return (
      <PageLayout className={classNames(styles.adminShell, className)} style={style}>
        <div className={styles.stateCard}>
          <div className={styles.stateIcon}>⏳</div>
          <h1 className={styles.stateTitle}>טוען את אזור הניהול</h1>
          <p className={styles.stateDescription}>רק רגע, אנחנו מוודאים את הרשאות המשתמש.</p>
        </div>
      </PageLayout>
    );
  }

  if (!isModerator) {
    return (
      <PageLayout className={classNames(styles.adminShell, className)} style={style}>
        <div className={styles.stateCard}>
          <div className={styles.stateIcon}>🔒</div>
          <h1 className={styles.stateTitle}>הגישה חסומה</h1>
          <p className={styles.stateDescription}>
            אזור הניהול מיועד למודרטורים ואדמינים בלבד. אם אתם סבורים שזו טעות, פנו לצוות הקהילה.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={classNames(styles.adminShell, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>אזור ניהול</div>
        <h1 className={styles.title}>לוח בקרה</h1>
        <p className={styles.subtitle}>
          ניהול מלא של האקוסיסטם — משתמשים, תוכן, אירועים ומודרציה. גישה למודרטורים ואדמינים בלבד.
        </p>
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs items={tabItems} activeKey={activePanelId} onChange={(key) => setActiveId(key)} />
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <ul className={styles.navList}>
            {visiblePanels.map((panel) => (
              <li key={panel.id}>
                <button
                  type="button"
                  className={classNames(styles.navItem, panel.id === activePanelId && styles.navItemActive)}
                  onClick={() => setActiveId(panel.id)}
                >
                  <span className={styles.navIcon}>{panelIconFor(panel.id)}</span>
                  <span className={styles.navLabel}>{panel.label}</span>
                  {hasBadge(panel.badgeCount) && (
                    <>
                      <Badge variant="warning" className={styles.navBadge}>
                        {panel.badgeCount}
                      </Badge>
                      {/* the badge shows a bare number; screen readers get the meaning. */}
                      <span className={styles.srOnly}>{badgeLabelFor(panel.badgeCount)}</span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.content}>
          {ActivePanelComponent ? (
            <ActivePanelComponent />
          ) : (
            <div className={styles.empty}>לא נמצאו פאנלים זמינים לתצוגה.</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
