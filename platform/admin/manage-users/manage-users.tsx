import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { RoleSelector } from '@helemclub/platform.ui.role-selector';
import type { UserRole } from '@helemclub/platform.entities.user';
import type { PlainUser } from '@helemclub/platform.entities.user';
import { usePlatformUsers } from './use-platform-users.js';
import { SearchIcon } from './search-icon.js';
import styles from './manage-users.module.scss';

function formatJoinedDate(isoDate: string): string {
  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) return isoDate;
  return parsedDate.toLocaleDateString(`he-IL`);
}

function userInitial(name: string): string {
  return name.trim().charAt(0) || `?`;
}

export type ManageUsersProps = {
  /**
   * mock list of platform users, bypassing the users list query. role
   * changes are applied locally to the mock list. useful for tests and
   * previews.
   */
  mockUsers?: PlainUser[];

  /**
   * mock data for the currently signed-in user, used to bypass the admin
   * access check. pass null to simulate a signed-out state. useful for
   * tests and previews.
   */
  mockCurrentUser?: PlainUser | null;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

function ManageUsersContent({ mockUsers, className, style }: Omit<ManageUsersProps, `mockCurrentUser`>) {
  const [query, setQuery] = useState(``);
  const hasMock = mockUsers !== undefined;
  const { users, loading, error, updateRole, updating } = usePlatformUsers(
    hasMock ? { query, mockData: mockUsers } : { query }
  );

  const rows: TableRow[] = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.displayName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || ``,
        createdAt: user.createdAt,
      })),
    [users]
  );

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: `name`,
        header: `שם מלא`,
        renderCell: (row) => {
          const name = String(row.name || ``);
          const avatarUrl = row.avatarUrl ? String(row.avatarUrl) : ``;
          return (
            <div className={styles.userCell}>
              <span className={styles.avatar}>
                {avatarUrl ? (
                  <img className={styles.avatarImage} src={avatarUrl} alt={name} />
                ) : (
                  userInitial(name)
                )}
              </span>
              <span className={styles.userName}>{name}</span>
            </div>
          );
        },
      },
      { key: `email`, header: `דוא"ל`, hideOnMobile: true },
      {
        key: `role`,
        header: `תפקיד`,
        renderCell: (row) => {
          const userId = String(row.id);
          const role = row.role as UserRole;
          return (
            <RoleSelector
              value={role}
              disabled={updating}
              onChange={(nextRole) => updateRole(userId, nextRole)}
            />
          );
        },
      },
      {
        key: `createdAt`,
        header: `הצטרפות`,
        align: `end`,
        hideOnMobile: true,
        renderCell: (row) => formatJoinedDate(String(row.createdAt)),
      },
    ],
    [updating, updateRole]
  );

  return (
    <div className={classNames(styles.manageUsers, className)} style={style}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>אזור ניהול</div>
          <h1 className={styles.title}>ניהול משתמשים</h1>
          <p className={styles.subtitle}>
            חיפוש חברי קהילה ועדכון תפקידים — חבר, כותב, מודרטור ואדמין.
          </p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchField}>
            <TextInput
              placeholder="חיפוש לפי שם או דוא&quot;ל"
              icon={<SearchIcon />}
              value={query}
              onChange={(value) => setQuery(value)}
            />
          </div>
          <span className={styles.countLabel}>{`${rows.length} משתמשים נמצאו`}</span>
        </div>

        {error ? (
          <div className={styles.errorMessage}>אירעה שגיאה בטעינת רשימת המשתמשים.</div>
        ) : loading ? (
          <div className={styles.stateMessage}>טוען משתמשים...</div>
        ) : (
          <Table
            columns={columns}
            rows={rows}
            emptyMessage="לא נמצאו משתמשים התואמים את החיפוש"
          />
        )}
      </div>
    </div>
  );
}

/**
 * admin panel (RTL) for listing and searching platform users and changing
 * their role via the role selector. restricted to users holding the admin
 * role; signed-out users are redirected and insufficiently privileged
 * users see an access-denied message.
 */
export function ManageUsers({ mockUsers, mockCurrentUser, className, style }: ManageUsersProps) {
  const hasMockCurrentUser = mockCurrentUser !== undefined;

  return (
    <ProtectedRoute
      allowedRoles={[`admin`]}
      mockData={hasMockCurrentUser ? mockCurrentUser : undefined}
    >
      <ManageUsersContent mockUsers={mockUsers} className={className} style={style} />
    </ProtectedRoute>
  );
}
