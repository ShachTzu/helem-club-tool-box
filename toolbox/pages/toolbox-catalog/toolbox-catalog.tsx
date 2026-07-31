import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { DomainFilter, type DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';
import { AppGrid } from '@helemclub/toolbox.ui.app-grid';
import { useApps, type AppSort, type UseAppsOptions } from '@helemclub/toolbox.hooks.use-apps';
import styles from './toolbox-catalog.module.scss';

const SORTS: { key: AppSort; label: string }[] = [
  { key: 'rating', label: '⭐ דירוג' },
  { key: 'clicks', label: '🔥 פופולריות' },
];

export type ToolboxCatalogProps = {
  /**
   * small eyebrow label shown above the hero title.
   */
  heroEyebrow?: string;

  /**
   * main hero title.
   */
  heroTitle?: string;

  /**
   * hero subtitle describing the catalog.
   */
  heroSubtitle?: string;

  /**
   * route to the tool-submission page.
   */
  submitHref?: string;

  /**
   * route to the community wishlist page.
   */
  wishlistHref?: string;

  /**
   * provide mock apps to bypass the query, useful for tests and previews.
   */
  mockApps?: UseAppsOptions['mockData'];

  /**
   * provide mock domains to the domain filter, useful for tests and previews.
   */
  mockDomains?: DomainFilterProps['mockDomains'];

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
 * toolbox catalog page (/toolbox): a hero band followed by domain + sort
 * filters and a responsive grid of published coping apps. free browsing,
 * no sign-in required. RTL, responsive.
 */
export function ToolboxCatalog({
  heroEyebrow = `ארגז הכלים`,
  heroTitle = `אפליקציות שעוזרות באמת להתמודד`,
  heroSubtitle = `קטלוג מדורג ומסונן של אפליקציות התמודדות, שנבחרו ומדורגות ע"י קהילת הלם קלאב. גלישה חופשית לגמרי — בלי הרשמה.`,
  submitHref = `/toolbox/submit`,
  wishlistHref = `/toolbox/wishlist`,
  mockApps,
  mockDomains,
  className,
  style,
}: ToolboxCatalogProps) {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [sort, setSort] = useState<AppSort>('rating');

  const hasMock = mockApps !== undefined;
  const { apps, loading } = useApps(
    hasMock
      ? { mockData: mockApps, sort, domainIds: selectedDomains }
      : { sort, domainIds: selectedDomains }
  );

  const visibleApps = useMemo(() => {
    const plain = apps.map((app) => app.toObject());
    if (selectedDomains.length === 0) return plain;
    return plain.filter((app) => app.domains?.some((domain) => selectedDomains.includes(domain)));
  }, [apps, selectedDomains]);

  return (
    <div className={classNames(styles.toolboxCatalog, className)} style={style}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {heroEyebrow && <div className={styles.heroEyebrow}>{heroEyebrow}</div>}
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          {heroSubtitle && <p className={styles.heroSubtitle}>{heroSubtitle}</p>}
          <div className={styles.heroActions}>
            <Link to={submitHref} className={styles.primaryAction}>➕ הגשת כלי</Link>
            <Link to={wishlistHref} className={styles.ghostAction}>💡 רשימת משאלות</Link>
          </div>
        </div>
      </section>

      <PageLayout>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{`${visibleApps.length} אפליקציות`}</h2>
          <div className={styles.sortGroup}>
            {SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={classNames(styles.sortButton, sort === option.key && styles.sortButtonActive)}
                onClick={() => setSort(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <DomainFilter
          value={selectedDomains}
          onChange={(next) => setSelectedDomains(next)}
          onlyWithContent
          mockDomains={mockDomains}
          className={styles.domainFilter}
        />

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))}
          </div>
        ) : (
          <AppGrid
            apps={visibleApps}
            appLinkBase="/toolbox"
            emptyTitle={selectedDomains.length > 0 ? undefined : 'עוד רגע מתמלא'}
            emptyDescription={
              selectedDomains.length > 0
                ? undefined
                : 'האפליקציות הראשונות בדרך — מהאקתון הקהילה. חזרו לבקר בקרוב, או הגישו כלי משלכם.'
            }
            emptyActionLabel={selectedDomains.length > 0 ? 'איפוס סינון' : 'הגשת כלי'}
            emptyActionHref={selectedDomains.length > 0 ? '/toolbox' : submitHref}
          />
        )}
      </PageLayout>
    </div>
  );
}
