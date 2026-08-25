import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute, type ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';
import { Button } from '@helemclub/design.actions.button';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { useAuthors, type UseAuthorsOptions } from '@helemclub/blog.hooks.use-authors';
import styles from './manage-authors.module.scss';

function formatLastPostDate(dateString?: string) {
  if (!dateString) return `טרם פורסם`;

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return `טרם פורסם`;

  return parsedDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export type ManageAuthorsProps = {
  /**
   * provide mock data for the author list, bypassing the GraphQL query.
   * useful for tests and previews.
   */
  mockAuthors?: UseAuthorsOptions['mockData'];

  /**
   * provide mock data for the current user, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
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

type ManageAuthorsPanelProps = {
  mockAuthors?: UseAuthorsOptions['mockData'];
  className?: string;
  style?: React.CSSProperties;
};

function ManageAuthorsPanel({ mockAuthors, className, style }: ManageAuthorsPanelProps) {
  const hasMockAuthors = mockAuthors !== undefined;
  const { authors, loading, error, setWritePermission, permissionLoading } = useAuthors(
    hasMockAuthors ? { mockData: mockAuthors } : undefined
  );
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const writersCount = useMemo(
    () => authors.filter((author) => author.hasWritePermission).length,
    [authors]
  );

  const handleToggle = async (userId: string, currentPermission: boolean) => {
    setPendingUserId(userId);
    await setWritePermission(userId, !currentPermission);
    setPendingUserId(null);
  };

  const columns: TableColumn[] = useMemo(
    () => [
      { key: `name`, header: `שם הכותב/ת` },
      { key: `postCount`, header: `מספר פוסטים`, align: `center` },
      { key: `lastPostLabel`, header: `פוסט אחרון`, align: `center`, hideOnMobile: true },
      {
        key: `status`,
        header: `הרשאת כתיבה`,
        align: `center`,
        renderCell: (row: TableRow) => (
          <span
            className={classNames(
              styles.statusBadge,
              row.hasWritePermission ? styles.statusActive : styles.statusInactive
            )}
          >
            {row.hasWritePermission ? `פעילה` : `לא פעילה`}
          </span>
        ),
      },
      {
        key: `actions`,
        header: `פעולות`,
        align: `end`,
        renderCell: (row: TableRow) => {
          const userId = String(row.userId);
          const canWrite = Boolean(row.hasWritePermission);
          const isPending = permissionLoading && pendingUserId === userId;

          return (
            <Button
              variant={canWrite ? `danger` : `primary`}
              size="sm"
              loading={isPending}
              onClick={() => handleToggle(userId, canWrite)}
            >
              {canWrite ? `בטל הרשאה` : `הענק הרשאה`}
            </Button>
          );
        },
      },
    ],
    [permissionLoading, pendingUserId]
  );

  const rows: TableRow[] = useMemo(
    () =>
      authors.map((author) => ({
        id: author.id,
        userId: author.userId,
        name: author.name,
        postCount: author.postCount,
        lastPostLabel: formatLastPostDate(author.lastPostDate),
        hasWritePermission: author.hasWritePermission,
      })),
    [authors]
  );

  return (
    <div className={classNames(styles.manageAuthors, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>✍️</div>
        <div className={styles.headerText}>
          <h2 className={styles.title}>ניהול כותבים</h2>
          <p className={styles.subtitle}>
            הענקה וביטול של הרשאת כתיבה לכותבי בלוג, וצפייה במספר הפוסטים שכל כותב/ת פרסמו.
          </p>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{authors.length}</div>
          <div className={styles.summaryLabel}>סה״כ כותבים</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{writersCount}</div>
          <div className={styles.summaryLabel}>בעלי הרשאת כתיבה</div>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>אירעה שגיאה בטעינת רשימת הכותבים. נסו שוב מאוחר יותר.</div>
      )}

      {loading ? (
        <div className={styles.loadingState}>טוען רשימת כותבים...</div>
      ) : (
        <Table columns={columns} rows={rows} rowKey="id" emptyMessage="לא נמצאו כותבים במערכת" />
      )}
    </div>
  );
}

/**
 * admin panel for managing blog authors: grants or revokes write permission
 * and shows the number of posts published by each author. restricted to
 * users holding the admin role or scoped in as content admins, registered
 * as an AdminPanel in the platform's admin shell.
 */
export function ManageAuthors({ mockAuthors, mockUser, className, style }: ManageAuthorsProps) {
  return (
    <ProtectedRoute allowedRoles={[`admin`]} allowContentAdmin mockData={mockUser}>
      <ManageAuthorsPanel mockAuthors={mockAuthors} className={className} style={style} />
    </ProtectedRoute>
  );
}
