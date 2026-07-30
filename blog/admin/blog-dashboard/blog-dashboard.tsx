import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useBlogStats } from '@helemclub/blog.hooks.use-blog-stats';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { Card } from '@helemclub/design.content.card';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { Tooltip } from '@helemclub/design.overlays.tooltip';
import { Tabs } from '@helemclub/design.navigation.tabs';
import type { TabItem } from '@helemclub/design.navigation.tabs';
import type { TimeRangePreset } from './time-range-preset-type.js';
import type { BlogDashboardStats } from './blog-dashboard-stats-type.js';
import type { BlogDashboardUser } from './blog-dashboard-user-type.js';
import styles from './blog-dashboard.module.scss';

const TIME_RANGE_ITEMS: TabItem[] = [
  { key: `day`, label: `היום` },
  { key: `week`, label: `השבוע` },
  { key: `month`, label: `החודש` },
  { key: `quarter`, label: `רבעון` },
  { key: `half`, label: `חצי שנה` },
  { key: `year`, label: `שנה` },
  { key: `custom`, label: `טווח מותאם` },
];

const PRESET_TO_RANGE: Record<string, string> = {
  day: `1d`,
  week: `7d`,
  month: `30d`,
  quarter: `90d`,
  half: `180d`,
  year: `365d`,
};

const numberFormatter = new Intl.NumberFormat(`he-IL`);

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export type BlogDashboardProps = {
  /**
   * provide mock stats data to bypass the GraphQL query, useful for tests
   * and previews.
   */
  mockStats?: BlogDashboardStats;

  /**
   * provide mock data for the current user, bypassing the auth query.
   * pass null to simulate a signed-out state.
   */
  mockUser?: BlogDashboardUser | null;

  /**
   * path to redirect anonymous or unauthorized users to.
   */
  redirectTo?: string;

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
 * blog admin dashboard: a global time filter, headline metrics (posts,
 * unique visitors, views), a top 10 posts panel, an authors table with a
 * hover popover listing each author's posts, and engagement metrics
 * (comments/reactions/saves) alongside verified members. restricted to
 * admins. RTL.
 */
export function BlogDashboard({
  mockStats,
  mockUser,
  redirectTo = `/login`,
  className,
  style,
}: BlogDashboardProps) {
  return (
    <ProtectedRoute allowedRoles={['admin']} redirectTo={redirectTo} mockData={mockUser}>
      <BlogDashboardContent mockStats={mockStats} className={className} style={style} />
    </ProtectedRoute>
  );
}

type BlogDashboardContentProps = {
  mockStats?: BlogDashboardStats;
  className?: string;
  style?: React.CSSProperties;
};

function BlogDashboardContent({ mockStats, className, style }: BlogDashboardContentProps) {
  const [preset, setPreset] = useState<TimeRangePreset>(`month`);
  const [customFrom, setCustomFrom] = useState(``);
  const [customTo, setCustomTo] = useState(``);

  const range = useMemo(() => {
    if (preset === `custom`) {
      return customFrom && customTo ? { from: customFrom, to: customTo } : undefined;
    }
    return { preset: PRESET_TO_RANGE[preset] };
  }, [preset, customFrom, customTo]);

  const hasMockStats = mockStats !== undefined;
  const { stats, loading, error } = useBlogStats(range, hasMockStats ? { mockData: mockStats } : undefined);

  const topPosts = useMemo(() => (stats ? stats.topPosts.slice(0, 10) : []), [stats]);
  const authors = useMemo(() => (stats ? stats.authors : []), [stats]);

  const authorRows: TableRow[] = useMemo(
    () =>
      authors.map((author) => ({
        name: author.name,
        postCount: author.postCount,
        lastPostDate: author.lastPostDate || `—`,
      })),
    [authors]
  );

  const authorColumns: TableColumn[] = useMemo(
    () => [
      {
        key: `name`,
        header: `כותב/ת`,
        renderCell: (row) => {
          const author = authors.find((item) => item.name === row.name);
          const posts = author?.posts || [];
          return (
            <Tooltip
              placement="top"
              content={
                posts.length > 0 ? (
                  <div className={styles.authorPostsTooltip}>
                    {posts.map((post) => (
                      <div key={`${post.title}-${post.date}`} className={styles.authorPostsTooltipItem}>
                        <span>{post.title}</span>
                        <span className={styles.authorPostsTooltipDate}>{post.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  `אין כתבות עדיין`
                )
              }
            >
              <span className={styles.authorName}>{String(row.name)}</span>
            </Tooltip>
          );
        },
      },
      { key: `postCount`, header: `מספר כתבות`, align: `center` },
      { key: `lastPostDate`, header: `כתבה אחרונה`, align: `end` },
    ],
    [authors]
  );

  return (
    <div className={classNames(styles.dashboard, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>ניהול תוכן</div>
        <h1 className={styles.title}>דשבורד בלוג</h1>
        <p className={styles.subtitle}>סקירת ביצועים, מעורבות קהילתית ותרומת הכותבים לבלוג הלם קלאב.</p>
      </div>

      <div className={styles.filterBar}>
        <Tabs items={TIME_RANGE_ITEMS} activeKey={preset} onChange={(key) => setPreset(key as TimeRangePreset)} />
        {preset === `custom` && (
          <div className={styles.customRange}>
            <label className={styles.customRangeField}>
              <span>מתאריך</span>
              <input
                type="date"
                className={styles.customRangeInput}
                value={customFrom}
                onChange={(event) => setCustomFrom(event.target.value)}
              />
            </label>
            <label className={styles.customRangeField}>
              <span>עד תאריך</span>
              <input
                type="date"
                className={styles.customRangeInput}
                value={customTo}
                onChange={(event) => setCustomTo(event.target.value)}
              />
            </label>
          </div>
        )}
      </div>

      {loading && <div className={styles.stateMessage}>טוען נתונים...</div>}
      {!loading && error && <div className={styles.stateMessage}>אירעה שגיאה בטעינת נתוני הבלוג.</div>}

      {!loading && !error && (
        <>
          <div className={styles.metricsGrid}>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{formatNumber(stats?.totalPosts || 0)}</span>
              <span className={styles.metricLabel}>סה&quot;כ כתבות</span>
            </Card>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{formatNumber(stats?.uniqueVisitors || 0)}</span>
              <span className={styles.metricLabel}>מבקרים ייחודיים</span>
            </Card>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{formatNumber(stats?.totalViews || 0)}</span>
              <span className={styles.metricLabel}>סה&quot;כ צפיות</span>
            </Card>
          </div>

          <div className={styles.sectionsGrid}>
            <Card className={styles.panelCard}>
              <h2 className={styles.panelTitle}>10 הכתבות המובילות</h2>
              {topPosts.length === 0 ? (
                <p className={styles.emptyText}>אין עדיין נתוני צפיות להצגה בטווח שנבחר.</p>
              ) : (
                <ol className={styles.topPostsList}>
                  {topPosts.map((post, index) => (
                    <li key={post.id} className={styles.topPostsItem}>
                      <span className={styles.topPostsRank}>{index + 1}</span>
                      <span className={styles.topPostsTitle}>{post.title}</span>
                      <span className={styles.topPostsViews}>{formatNumber(post.views)} צפיות</span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            <Card className={styles.panelCard}>
              <h2 className={styles.panelTitle}>כותבים</h2>
              <p className={styles.panelSubtitle}>ריחוף מעל שם הכותב/ת מציג את רשימת הכתבות שלו.</p>
              <Table
                columns={authorColumns}
                rows={authorRows}
                rowKey="name"
                emptyMessage="אין כותבים להצגה בטווח שנבחר"
              />
            </Card>
          </div>

          <Card className={styles.panelCard}>
            <h2 className={styles.panelTitle}>מעורבות קהילתית</h2>
            <div className={styles.engagementGrid}>
              <div className={styles.engagementItem}>
                <span className={styles.engagementValue}>{formatNumber(stats?.comments || 0)}</span>
                <span className={styles.engagementLabel}>💬 תגובות</span>
              </div>
              <div className={styles.engagementItem}>
                <span className={styles.engagementValue}>{formatNumber(stats?.reactions || 0)}</span>
                <span className={styles.engagementLabel}>❤️ תגובות רגש</span>
              </div>
              <div className={styles.engagementItem}>
                <span className={styles.engagementValue}>{formatNumber(stats?.saves || 0)}</span>
                <span className={styles.engagementLabel}>🔖 שמירות</span>
              </div>
              <div className={styles.engagementItem}>
                <span className={styles.engagementValue}>{formatNumber(stats?.verifiedMembers || 0)}</span>
                <span className={styles.engagementLabel}>✅ חברים מאומתים</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
