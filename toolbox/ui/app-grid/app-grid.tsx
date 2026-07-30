import React from 'react';
import classNames from 'classnames';
import { mockApps, type PlainApp } from '@helemclub/toolbox.entities.app';
import { AppCard, type AppCardDomain } from '@helemclub/toolbox.ui.app-card';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import styles from './app-grid.module.scss';

const defaultApps: PlainApp[] = mockApps().map((app) => app.toObject());

function toAppCardDomains(domains?: string[]): AppCardDomain[] {
  return (domains || []).map((domain) => ({ id: domain, slug: domain, name: domain }));
}

export type AppGridProps = {
  /**
   * apps to render as cards in the grid.
   */
  apps?: PlainApp[];

  /**
   * base path used to build the link to an app's detail page.
   */
  appLinkBase?: string;

  /**
   * base path used to build the link to a domain's lobby page.
   */
  domainLinkBase?: string;

  /**
   * title shown in the empty state when there are no apps to display.
   */
  emptyTitle?: string;

  /**
   * description shown in the empty state when there are no apps to display.
   */
  emptyDescription?: string;

  /**
   * label for the empty state action button, rendered only alongside emptyActionHref.
   */
  emptyActionLabel?: string;

  /**
   * route the empty state action button navigates to.
   */
  emptyActionHref?: string;

  /**
   * class name for the grid container.
   */
  className?: string;

  /**
   * style for the grid container.
   */
  style?: React.CSSProperties;
};

/**
 * a responsive grid of app cards from the toolbox catalog. shows a friendly
 * empty state when there are no apps matching the current filters.
 */
export function AppGrid({
  apps = defaultApps,
  appLinkBase = `/toolbox`,
  domainLinkBase = `/domains`,
  emptyTitle = `לא נמצאו כלים מתאימים`,
  emptyDescription = `נסו לשנות את הסינון או את החיפוש, או חזרו לבדוק שוב מאוחר יותר.`,
  emptyActionLabel,
  emptyActionHref,
  className,
  style,
}: AppGridProps) {
  if (apps.length === 0) {
    return (
      <div className={classNames(styles.emptyWrapper, className)} style={style}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          actionHref={emptyActionHref}
        />
      </div>
    );
  }

  return (
    <div className={classNames(styles.grid, className)} style={style}>
      {apps.map((app) => (
        <AppCard
          key={app.id}
          icon={app.icon}
          name={app.name}
          subtitle={app.subtitle}
          avgRating={app.avgRating}
          ratingCount={app.ratingCount}
          clickCount={app.clickCount}
          isFeatured={app.isFeatured}
          domains={toAppCardDomains(app.domains)}
          domainLinkBase={domainLinkBase}
          href={`${appLinkBase}/${app.slug}`}
        />
      ))}
    </div>
  );
}
