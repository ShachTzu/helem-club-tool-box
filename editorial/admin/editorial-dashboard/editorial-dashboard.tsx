import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { Card } from '@helemclub/design.content.card';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Spinner } from '@helemclub/design.loaders.spinner';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { Badge } from '@helemclub/design.content.badge';
import { Avatar } from '@helemclub/design.content.avatar';
import { SelectList } from '@helemclub/design.inputs.select-list';
import type { SelectListOption } from '@helemclub/design.inputs.select-list';
import { useEditorialStats } from '@helemclub/editorial.hooks.use-editorial-stats';
import type { EditorialStats } from '@helemclub/editorial.hooks.use-editorial-stats';
import { useDrafts } from '@helemclub/editorial.hooks.use-drafts';
import type { UseDraftsOptions } from '@helemclub/editorial.hooks.use-drafts';
import type { EditorialDashboardUser } from './editorial-dashboard-user-type.js';
import type { EditorialDashboardMockDraft } from './editorial-dashboard-mock-draft-type.js';
import styles from './editorial-dashboard.module.scss';

type TimeRangeDays = 7 | 30 | 90;

const TIME_RANGE_OPTIONS: SelectListOption[] = [
  { value: `7`, label: `7 הימים האחרונים` },
  { value: `30`, label: `30 הימים האחרונים` },
  { value: `90`, label: `90 הימים האחרונים` },
];

const numberFormatter = new Intl.NumberFormat(`he-IL`);

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatHours(value: number) {
  return `${numberFormatter.format(Math.round(value * 10) / 10)} שעות`;
}

function daysSince(dateString?: string) {
  if (!dateString) return 0;
  const parsed = new Date(dateString).getTime();
  if (Number.isNaN(parsed)) return 0;
  const diffMs = Date.now() - parsed;
  return Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
}

export type EditorialDashboardProps = {
  /**
   * provide mock editorial stats to bypass the GraphQL query, useful for
   * tests and previews.
   */
  mockStats?: EditorialStats;

  /**
   * provide mock drafts pending review, used to render the "longest
   * waiting" panel without hitting the network.
   */
  mockPendingDrafts?: EditorialDashboardMockDraft[];

  /**
   * provide mock data for the current user, bypassing the auth query. pass
   * null to simulate a signed-out state.
   */
  mockUser?: EditorialDashboardUser | null;

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
 * admin "editorial dashboard" panel: a global time range filter, headline
 * editorial metrics, a breakdown by content type, a reviewer activity
 * table and the longest-waiting drafts. restricted to admins. RTL.
 */
export function EditorialDashboard({
  mockStats,
  mockPendingDrafts,
  mockUser,
  redirectTo = `/login`,
  className,
  style,
}: EditorialDashboardProps) {
  return (
    <ProtectedRoute allowedRoles={['admin']} redirectTo={redirectTo} mockData={mockUser}>
      <EditorialDashboardContent
        mockStats={mockStats}
        mockPendingDrafts={mockPendingDrafts}
        className={className}
        style={style}
      />
    </ProtectedRoute>
  );
}

type EditorialDashboardContentProps = {
  mockStats?: EditorialStats;
  mockPendingDrafts?: EditorialDashboardMockDraft[];
  className?: string;
  style?: React.CSSProperties;
};

function EditorialDashboardContent({ mockStats, mockPendingDrafts, className, style }: EditorialDashboardContentProps) {
  const [days, setDays] = useState<TimeRangeDays>(30);

  const hasMockStats = mockStats !== undefined;
  const { stats, loading, error, setDays: setStatsDays } = useEditorialStats(
    days,
    hasMockStats ? { mockData: mockStats } : undefined
  );

  const hasMockDrafts = mockPendingDrafts !== undefined;
  const draftsOptions: UseDraftsOptions = hasMockDrafts
    ? { status: ['in_review'], mockData: mockPendingDrafts }
    : { status: ['in_review'], limit: 20 };
  const { drafts: pendingDrafts, loading: pendingLoading } = useDrafts(draftsOptions);

  const handleRangeChange = (value: string | string[]) => {
    const nextDays = Number(Array.isArray(value) ? value[0] : value) as TimeRangeDays;
    setDays(nextDays);
    setStatsDays(nextDays);
  };

  const contentTypeLabels = useMemo(() => {
    const map: Record<string, string> = {};
    (stats?.byContentType || []).forEach((item) => {
      map[item.contentType] = item.label;
    });
    return map;
  }, [stats]);

  const contentTypeColumns: TableColumn[] = useMemo(
    () => [
      { key: `label`, header: `סוג תוכן` },
      { key: `count`, header: `טיוטות בתקופה`, align: `center` },
      { key: `published`, header: `פורסמו בתקופה (משוער)`, align: `end` },
    ],
    []
  );

  const contentTypeRows: TableRow[] = useMemo(() => {
    if (!stats) return [];
    const totalDrafts = stats.byContentType.reduce((sum, item) => sum + item.count, 0);
    return stats.byContentType.map((item) => {
      const share = totalDrafts > 0 ? item.count / totalDrafts : 0;
      const publishedEstimate = Math.round(share * stats.publishedThisPeriod);
      return {
        id: item.contentType,
        label: item.label,
        count: item.count,
        published: publishedEstimate,
      };
    });
  }, [stats]);

  const reviewerColumns: TableColumn[] = useMemo(
    () => [
      {
        key: `actorName`,
        header: `מנחה`,
        renderCell: (row) => (
          <div className={styles.reviewerCell}>
            <Avatar name={String(row.actorName)} size="small" />
            <span className={styles.reviewerName}>{String(row.actorName)}</span>
          </div>
        ),
      },
      { key: `approvals`, header: `אישורים`, align: `center` },
      { key: `rejections`, header: `דחיות`, align: `center` },
      {
        key: `avgResponse`,
        header: `זמן תגובה ממוצע`,
        align: `end`,
        hideOnMobile: true,
        renderCell: (row) => <span>{String(row.avgResponse)}</span>,
      },
    ],
    []
  );

  const reviewerRows: TableRow[] = useMemo(() => {
    if (!stats) return [];
    const avgResponseLabel = formatHours(stats.avgHoursToApproval);
    return stats.byReviewer.map((reviewer) => ({
      id: reviewer.actorId,
      actorName: reviewer.actorName,
      approvals: reviewer.approvals,
      rejections: reviewer.rejections,
      avgResponse: avgResponseLabel,
    }));
  }, [stats]);

  const longestWaiting = useMemo(() => {
    return [...pendingDrafts]
      .sort((a, b) => new Date(a.submittedAt || a.createdAt).getTime() - new Date(b.submittedAt || b.createdAt).getTime())
      .slice(0, 5);
  }, [pendingDrafts]);

  const isLoading = loading || pendingLoading;

  return (
    <PageLayout className={classNames(styles.dashboard, className)} style={style}>
      <SectionLayout spacing="compact">
        <span className={styles.eyebrow}>ניהול תוכן</span>
        <Heading level={1} className={styles.title}>
          לוח עריכה
        </Heading>
        <Paragraph size="lg" muted className={styles.subtitle}>
          סקירת פעילות המערכת העריכתית: היקף הטיוטות, קצב האישורים ותוחלת הזמן עד פרסום.
        </Paragraph>

        <div className={styles.filterBar}>
          <SelectList
            label="טווח זמן"
            className={styles.filterSelect}
            searchable={false}
            options={TIME_RANGE_OPTIONS}
            value={String(days)}
            onChange={(value) => handleRangeChange(value)}
          />
        </div>

        {isLoading && (
          <div className={styles.stateMessage}>
            <Spinner size="large" message="טוענים את נתוני לוח העריכה..." />
          </div>
        )}

        {!isLoading && error && <div className={styles.stateMessage}>אירעה שגיאה בטעינת נתוני לוח העריכה.</div>}

        {!isLoading && !error && (
          <>
            <div className={styles.metricsGrid}>
              <Card className={styles.metricCard}>
                <span className={styles.metricValue}>{formatNumber(stats?.totalDrafts || 0)}</span>
                <span className={styles.metricLabel}>סה&quot;כ טיוטות</span>
              </Card>
              <Card className={styles.metricCard}>
                <span className={styles.metricValue}>{formatNumber(stats?.pendingReview || 0)}</span>
                <span className={styles.metricLabel}>ממתינות לביקורת</span>
              </Card>
              <Card className={styles.metricCard}>
                <span className={styles.metricValue}>{formatNumber(stats?.approvedThisPeriod || 0)}</span>
                <span className={styles.metricLabel}>אושרו בתקופה</span>
              </Card>
              <Card className={styles.metricCard}>
                <span className={styles.metricValue}>{formatNumber(stats?.publishedThisPeriod || 0)}</span>
                <span className={styles.metricLabel}>פורסמו בתקופה</span>
              </Card>
              <Card className={styles.metricCard}>
                <span className={styles.metricValue}>{formatNumber(stats?.rejectedThisPeriod || 0)}</span>
                <span className={styles.metricLabel}>נדחו בתקופה</span>
              </Card>
              <Card className={styles.metricCard}>
                <span className={styles.metricValue}>{formatHours(stats?.avgHoursToApproval || 0)}</span>
                <span className={styles.metricLabel}>ממוצע זמן לאישור</span>
              </Card>
            </div>

            <div className={styles.sectionsGrid}>
              <Card className={styles.panelCard}>
                <Heading level={3} className={styles.panelTitle}>
                  פילוח לפי סוג תוכן
                </Heading>
                <Table
                  columns={contentTypeColumns}
                  rows={contentTypeRows}
                  rowKey="id"
                  emptyMessage="אין נתוני תוכן להצגה בטווח שנבחר"
                />
              </Card>

              <Card className={styles.panelCard}>
                <Heading level={3} className={styles.panelTitle}>
                  פעילות מנחים
                </Heading>
                <Paragraph size="sm" muted className={styles.panelSubtitle}>
                  אישורים, דחיות וזמן תגובה ממוצע לכל מנחה בתקופה שנבחרה.
                </Paragraph>
                <Table
                  columns={reviewerColumns}
                  rows={reviewerRows}
                  rowKey="id"
                  emptyMessage="אין פעילות מנחים להצגה בטווח שנבחר"
                />
              </Card>
            </div>

            <Card className={styles.panelCard}>
              <Heading level={3} className={styles.panelTitle}>
                ממתינות הכי הרבה זמן
              </Heading>
              {longestWaiting.length === 0 ? (
                <Paragraph size="md" muted className={styles.emptyText}>
                  אין כרגע טיוטות הממתינות לביקורת.
                </Paragraph>
              ) : (
                <ul className={styles.pendingList}>
                  {longestWaiting.map((draft, index) => {
                    const waitingDays = daysSince(draft.submittedAt || draft.createdAt);
                    const contentTypeLabel = contentTypeLabels[draft.contentType] || draft.contentType;
                    return (
                      <li key={draft.id} className={styles.pendingItem}>
                        <span className={styles.pendingRank}>{index + 1}</span>
                        <div className={styles.pendingInfo}>
                          <span className={styles.pendingTitle}>{draft.title}</span>
                          <span className={styles.pendingMeta}>
                            {draft.authorName} · {contentTypeLabel}
                          </span>
                        </div>
                        <div className={styles.pendingWaiting}>
                          <Badge variant={waitingDays > 3 ? `danger` : `warning`}>
                            {waitingDays > 0 ? `${formatNumber(waitingDays)} ימים בהמתנה` : `נשלחה היום`}
                          </Badge>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </>
        )}
      </SectionLayout>
    </PageLayout>
  );
}
