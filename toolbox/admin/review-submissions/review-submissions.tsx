import React, { useState } from 'react';
import classNames from 'classnames';
import { useApps, type UseAppsOptions } from '@helemclub/toolbox.hooks.use-apps';
import { Table, type TableColumn, type TableRow } from '@helemclub/design.content.table';
import { Button } from '@helemclub/design.actions.button';
import { ProtectedRoute, type ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';
import styles from './review-submissions.module.scss';

type ReviewAction = `approve` | `reject` | `changes_requested`;

export type ReviewSubmissionsProps = {
  /**
   * provide mock pending apps to skip the network request, useful for tests and previews.
   */
  mockPendingData?: UseAppsOptions['mockPendingData'];

  /**
   * provide mock data for the current user, bypassing the auth query. pass null to
   * simulate a signed-out state. useful for tests and previews.
   */
  mockUser?: ProtectedRouteProps['mockData'];

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
 * submission review queue for the toolbox (RTL): lists pending tools awaiting
 * moderation and lets moderators/admins approve or reject each submission.
 * restricted to users holding the moderator or admin role, intended to be
 * registered as an AdminPanel in the platform's admin shell.
 */
export function ReviewSubmissions({ mockPendingData, mockUser, className, style }: ReviewSubmissionsProps) {
  const { pendingApps, pendingModeratorMeta, pendingLoading, pendingError, reviewApp } = useApps({
    mockPendingData,
  });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<ReviewAction | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleReview = async (appId: string, action: ReviewAction) => {
    setProcessingId(appId);
    setProcessingAction(action);
    try {
      await reviewApp({ appId, action, note: notes[appId]?.trim() || undefined });
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  const rows: TableRow[] = pendingApps.map((app) => ({
    id: app.id,
    icon: app.icon,
    name: app.name,
    subtitle: app.subtitle,
    developerName: app.developerName,
    contactEmail: pendingModeratorMeta[app.id]?.contactEmail || ``,
    domains: app.domains.join(`, `),
    costType: app.costType,
  }));

  const columns: TableColumn[] = [
    {
      key: `name`,
      header: `כלי`,
      renderCell: (row) => (
        <div className={styles.appCell}>
          <span className={styles.appIcon}>{String(row.icon)}</span>
          <div className={styles.appInfo}>
            <span className={styles.appName}>{String(row.name)}</span>
            <span className={styles.appSubtitle}>{String(row.subtitle)}</span>
          </div>
        </div>
      ),
    },
    { key: `developerName`, header: `מפתח/ת`, hideOnMobile: true },
    {
      key: `contactEmail`,
      header: `יצירת קשר`,
      hideOnMobile: true,
      renderCell: (row) => {
        const email = String(row.contactEmail || ``);
        return email ? <a href={`mailto:${email}`}>{email}</a> : <span>—</span>;
      },
    },
    { key: `domains`, header: `תחומים`, hideOnMobile: true },
    { key: `costType`, header: `עלות`, hideOnMobile: true },
    {
      key: `note`,
      header: `הערה למגיש`,
      hideOnMobile: true,
      renderCell: (row) => {
        const appId = String(row.id);
        return (
          <textarea
            className={styles.noteInput}
            value={notes[appId] || ``}
            onChange={(event) => setNotes((prev) => ({ ...prev, [appId]: event.target.value }))}
            placeholder="הערה אופציונלית — נשלחת למגיש/ה במייל"
          />
        );
      },
    },
    {
      key: `actions`,
      header: `פעולות`,
      align: `end`,
      renderCell: (row) => {
        const appId = String(row.id);
        const isProcessing = processingId === appId;
        return (
          <div className={styles.actionsCell}>
            <Button
              variant="primary"
              size="sm"
              disabled={isProcessing}
              loading={isProcessing && processingAction === `approve`}
              onClick={() => handleReview(appId, `approve`)}
            >
              אישור
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isProcessing}
              loading={isProcessing && processingAction === `changes_requested`}
              onClick={() => handleReview(appId, `changes_requested`)}
            >
              דורש תיקון
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={isProcessing}
              loading={isProcessing && processingAction === `reject`}
              onClick={() => handleReview(appId, `reject`)}
            >
              דחייה
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[`moderator`, `admin`]} mockData={mockUser}>
      <div className={classNames(styles.container, className)} style={style}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.eyebrow}>בקרת איכות</span>
            <h2 className={styles.title}>תור בדיקת הגשות</h2>
            <p className={styles.subtitle}>
              כלים שהוגשו ע&quot;י חברי הקהילה וממתינים לאישור לפני פרסום בארגז הכלים.
            </p>
          </div>
          <span className={styles.countBadge}>⏳ {pendingApps.length} ממתינים לבדיקה</span>
        </div>

        {pendingError && (
          <div className={styles.errorBanner}>אירעה שגיאה בטעינת ההגשות. נסו לרענן את העמוד.</div>
        )}

        {pendingLoading ? (
          <div className={styles.stateCard}>
            <div className={styles.stateIcon}>⏳</div>
            <h3 className={styles.stateTitle}>טוענים הגשות ממתינות</h3>
            <p className={styles.stateDescription}>רק רגע, אנחנו אוספים את הכלים שממתינים לבדיקה.</p>
          </div>
        ) : pendingApps.length === 0 ? (
          <div className={styles.stateCard}>
            <div className={styles.stateIcon}>✅</div>
            <h3 className={styles.stateTitle}>אין הגשות ממתינות</h3>
            <p className={styles.stateDescription}>
              כל הכבוד! כל הכלים שהוגשו נבדקו. הגשות חדשות יופיעו כאן.
            </p>
          </div>
        ) : (
          <Table columns={columns} rows={rows} emptyMessage="אין הגשות ממתינות" />
        )}
      </div>
    </ProtectedRoute>
  );
}
