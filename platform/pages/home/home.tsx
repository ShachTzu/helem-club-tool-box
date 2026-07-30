import React from 'react';
import classNames from 'classnames';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import type { PlainUser } from '@helemclub/platform.entities.user';
import { Hero, type HeroProps } from '@helemclub/platform.sections.hero';
import { EcosystemOverview, type EcosystemOverviewProps } from '@helemclub/platform.sections.ecosystem-overview';
import type { HomeDashboardPanel } from './home-dashboard-panel-type.js';
import type { HomeSectionEntry } from './home-section-entry-type.js';
import styles from './home.module.scss';

function greetingForHour(hour: number): string {
  if (hour < 5) return `לילה טוב`;
  if (hour < 12) return `בוקר טוב`;
  if (hour < 18) return `צהריים טובים`;
  return `ערב טוב`;
}

export type HomeProps = {
  /**
   * dashboard panels registered by feature aspects through the platform's
   * DashboardPanel slot, rendered above the marketing content for signed-in
   * members, ordered by their `order` field.
   */
  dashboardPanels?: HomeDashboardPanel[];

  /**
   * props forwarded to the hero section.
   */
  heroProps?: HeroProps;

  /**
   * props forwarded to the ecosystem overview section.
   */
  ecosystemProps?: EcosystemOverviewProps;

  /**
   * full-width home sections registered by feature aspects through the
   * platform's HomeSection slot (e.g. the community-wisdom hub and feature
   * previews). rendered below the ecosystem overview, ordered by `order`.
   */
  homeSections?: HomeSectionEntry[];

  /**
   * provide mock data for the current user, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
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
 * the home page (/). shows the public landing content — hero and ecosystem
 * overview — to every visitor. when the visitor is authenticated, a
 * personalized greeting and the registered dashboard panels are surfaced
 * above the marketing content. RTL.
 */
export function Home({
  dashboardPanels = [],
  heroProps,
  ecosystemProps,
  homeSections = [],
  mockUser,
  className,
  style,
}: HomeProps) {
  const hasMockUser = mockUser !== undefined;
  const { user } = useAuth(hasMockUser ? { mockData: mockUser } : undefined);

  const orderedPanels = [...dashboardPanels].sort((a, b) => (a.order || 0) - (b.order || 0));
  const orderedSections = [...homeSections].sort((a, b) => (a.order || 0) - (b.order || 0));
  const greeting = greetingForHour(new Date().getHours());

  return (
    <div className={classNames(styles.home, className)} style={style}>
      {user && (
        <section className={styles.greetingSection}>
          <div className={styles.greetingCard}>
            <div className={styles.greetingText}>
              <div className={styles.greetingEyebrow}>האזור האישי שלך</div>
              <h2 className={styles.greetingTitle}>
                {greeting}, {user.displayName}
              </h2>
              <p className={styles.greetingSubtitle}>
                שמחים לראות אתכם שוב. הנה עדכונים ולוחות מותאמים אישית מהאקוסיסטם של הלם קלאב.
              </p>
            </div>
            <span className={styles.greetingBadge}>👋 מחוברים</span>
          </div>
        </section>
      )}

      {user && orderedPanels.length > 0 && (
        <section className={styles.dashboardSection}>
          <div className={styles.dashboardGrid}>
            {orderedPanels.map((panel) => {
              const PanelComponent = panel.component;
              return <PanelComponent key={panel.id} />;
            })}
          </div>
        </section>
      )}

      <div className={styles.marketing}>
        <Hero {...heroProps} />
        <section className={styles.ecosystemSection}>
          <EcosystemOverview {...ecosystemProps} />
        </section>
        {orderedSections.map((section) => {
          const SectionComponent = section.component;
          return (
            <section key={section.id} className={styles.homeSection}>
              <SectionComponent />
            </section>
          );
        })}
      </div>
    </div>
  );
}
