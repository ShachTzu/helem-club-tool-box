import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { useModeration } from '@helemclub/engagement.hooks.use-moderation';
import type { PlainComment } from '@helemclub/engagement.entities.comment';
import type { ModerationQueueMockUser } from './moderation-queue-mock-user-type.js';
import styles from './moderation-queue.module.scss';

function formatHoursAgo(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return `לא ידוע`;
  const diffMs = Date.now() - created;
  const diffHours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
  if (diffHours < 1) return `לפני פחות משעה`;
  if (diffHours === 1) return `לפני שעה`;
  return `לפני ${diffHours} שעות`;
}

function authorLabelFor(comment: PlainComment): string {
  if (comment.isAnonymous || !comment.displayName) return `אורח/ת אנונימי/ת`;
  return comment.displayName;
}

export type ModerationQueueProps = {
  /**
   * provide mock data for the moderation queue, bypassing the GraphQL
   * query. useful for tests and previews.
   */
  mockData?: PlainComment[];

  /**
   * mock data for the current user, bypasses the auth check performed by
   * the protected route. pass null to simulate a signed-out state.
   */
  mockUser?: ModerationQueueMockUser | null;

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
 * moderation queue admin panel: lists hidden/reported comments awaiting a
 * moderator decision, showing report counts and a 48h soft resolution
 * target. lets moderators/admins restore a comment to public view or
 * delete it permanently. restricted to moderator/admin roles.
 */
export function ModerationQueue({ mockData, mockUser, className, style }: ModerationQueueProps) {
  return (
    <ProtectedRoute allowedRoles={[`moderator`, `admin`]} mockData={mockUser}>
      <ModerationQueuePanel mockData={mockData} className={className} style={style} />
    </ProtectedRoute>
  );
}

type ModerationQueuePanelProps = {
  mockData?: PlainComment[];
  className?: string;
  style?: React.CSSProperties;
};

function ModerationQueuePanel({ mockData, className, style }: ModerationQueuePanelProps) {
  const hasMockData = mockData !== undefined;
  const { comments, loading, error, refetch, resolving, restoreComment, deleteComment } = useModeration(
    hasMockData ? { mockData } : undefined
  );

  const [pendingId, setPendingId] = useState<string | undefined>(undefined);

  const handleRestore = (commentId: string) => {
    setPendingId(commentId);
    restoreComment(commentId).finally(() => setPendingId(undefined));
  };

  const handleDelete = (commentId: string) => {
    setPendingId(commentId);
    deleteComment(commentId).finally(() => setPendingId(undefined));
  };

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: `author`,
        header: `כותב/ת`,
        renderCell: (row: TableRow) => (
          <span className={styles.authorCell}>
            <span className={styles.authorName}>{String(row.displayName)}</span>
            <span className={styles.authorMeta}>{formatHoursAgo(String(row.createdAt))}</span>
          </span>
        ),
      },
      {
        key: `text`,
        header: `תוכן התגובה`,
        renderCell: (row: TableRow) => <span className={styles.textCell}>{String(row.text)}</span>,
      },
      {
        key: `reportCount`,
        header: `דיווחים`,
        align: `center`,
        renderCell: (row: TableRow) => {
          const count = Number(row.reportCount || 0);
          return (
            <span className={classNames(styles.reportBadge, count === 0 && styles.reportBadgeZero)}>
              {count}
            </span>
          );
        },
      },
      {
        key: `hidden`,
        header: `סטטוס`,
        align: `center`,
        hideOnMobile: true,
        renderCell: (row: TableRow) => (
          <span className={classNames(styles.statusBadge, row.hidden && styles.statusHidden)}>
            {row.hidden ? `מוסתר` : `גלוי`}
          </span>
        ),
      },
      {
        key: `actions`,
        header: `פעולות`,
        align: `end`,
        renderCell: (row: TableRow) => {
          const commentId = String(row.id);
          const isBusy = resolving && pendingId === commentId;
          return (
            <span className={styles.actions}>
              <Button
                variant="secondary"
                size="sm"
                disabled={isBusy}
                onClick={() => handleRestore(commentId)}
              >
                שחזור
              </Button>
              <Button variant="danger" size="sm" disabled={isBusy} onClick={() => handleDelete(commentId)}>
                מחיקה
              </Button>
            </span>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolving, pendingId]
  );

  const rows: TableRow[] = useMemo(
    () =>
      comments.map((comment) => ({
        id: comment.id,
        displayName: authorLabelFor(comment.toObject()),
        text: comment.text,
        reportCount: comment.reportCount,
        hidden: comment.hidden,
        createdAt: comment.createdAt,
      })),
    [comments]
  );

  return (
    <div className={classNames(styles.moderationQueue, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>תור מודרציה</h2>
          <p className={styles.subtitle}>
            תגובות שהוסתרו או דווחו על ידי חברי הקהילה, ממתינות להחלטת מודרטור: שחזור לתצוגה ציבורית או
            מחיקה לצמיתות.
          </p>
        </div>
        <span className={styles.hint}>
          <span className={styles.hintIcon}>⏱️</span>
          יעד טיפול רך: עד 48 שעות מרגע הדיווח
        </span>
      </div>

      {error && <div className={styles.errorState}>אירעה שגיאה בטעינת התור. נסו לרענן את העמוד.</div>}

      <div className={styles.toolbar}>
        <span className={styles.count}>
          <span className={styles.countNumber}>{rows.length}</span> תגובות ממתינות לטיפול
        </span>
        <Button
          variant="ghost"
          size="sm"
          className={styles.refreshButton}
          disabled={loading}
          onClick={() => refetch()}
        >
          רענון
        </Button>
      </div>

      {rows.length === 0 && !loading ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✅</div>
          <h3 className={styles.emptyTitle}>אין תגובות הממתינות למודרציה</h3>
          <p className={styles.emptyDescription}>כל התגובות שדווחו טופלו. עבודה יפה!</p>
        </div>
      ) : (
        <Table columns={columns} rows={rows} emptyMessage="אין תגובות הממתינות למודרציה" />
      )}
    </div>
  );
}
