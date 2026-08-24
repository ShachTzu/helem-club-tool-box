import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Button } from '@helemclub/design.actions.button';
import { Badge } from '@helemclub/design.content.badge';
import type { BadgeVariant } from '@helemclub/design.content.badge';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { RoleSelector } from '@helemclub/platform.ui.role-selector';
import type { UserRole, MembershipStatus } from '@helemclub/platform.entities.user';
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

const STATUS_LABELS: Record<MembershipStatus, string> = {
  pending: `ממתין לאישור`,
  approved: `מאושר`,
  rejected: `נדחה`,
};

const STATUS_VARIANTS: Record<MembershipStatus, BadgeVariant> = {
  pending: `warning`,
  approved: `success`,
  rejected: `danger`,
};

type StatusFilter = MembershipStatus | `all`;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: `all`, label: `הכל` },
  { value: `pending`, label: `ממתינים לאישור` },
  { value: `approved`, label: `מאושרים` },
  { value: `rejected`, label: `נדחו` },
];

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
  const [status, setStatus] = useState<StatusFilter>(`all`);
  const hasMock = mockUsers !== undefined;
  const {
    users,
    loading,
    error,
    updateRole,
    updating,
    approveMember,
    rejectMember,
    pendingCount,
    setContentAdmin,
  } = usePlatformUsers(hasMock ? { query, status, mockData: mockUsers } : { query, status });

  const rows: TableRow[] = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.displayName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || ``,
        createdAt: user.createdAt,
        membershipStatus: user.membershipStatus,
        contentAdmin: user.contentAdmin,
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
        key: `membershipStatus`,
        header: `סטטוס חברות`,
        renderCell: (row) => {
          const memberStatus = (row.membershipStatus as MembershipStatus) || `pending`;
          return (
            <Badge variant={STATUS_VARIANTS[memberStatus]} showDot>
              {STATUS_LABELS[memberStatus]}
            </Badge>
          );
        },
      },
      {
        key: `membershipActions`,
        header: `אישור חברות`,
        renderCell: (row) => {
          const userId = String(row.id);
          const memberStatus = (row.membershipStatus as MembershipStatus) || `pending`;
          if (memberStatus === `approved`) {
            return (
              <Button
                variant="ghost"
                size="sm"
                disabled={updating}
                onClick={() => rejectMember(userId)}
              >
                ביטול אישור
              </Button>
            );
          }
          return (
            <div className={styles.membershipActions}>
              <Button
                variant="primary"
                size="sm"
                disabled={updating}
                onClick={() => approveMember(userId)}
              >
                אישור
              </Button>
              {memberStatus === `pending` && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={updating}
                  onClick={() => rejectMember(userId)}
                >
                  דחייה
                </Button>
              )}
            </div>
          );
        },
      },
      {
        key: `contentAdmin`,
        header: `אדמין תוכן`,
        renderCell: (row) => {
          const userId = String(row.id);
          const role = row.role as UserRole;
          const isContentAdmin = Boolean(row.contentAdmin);

          if (role === `admin`) {
            return <span className={styles.stateMessage}>—</span>;
          }

          return (
            <Button
              variant={isContentAdmin ? `secondary` : `ghost`}
              size="sm"
              disabled={updating}
              onClick={() => setContentAdmin(userId, !isContentAdmin)}
            >
              {isContentAdmin ? `בטל אדמין תוכן` : `הפוך לאדמין תוכן`}
            </Button>
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
    [updating, updateRole, approveMember, rejectMember, setContentAdmin]
  );

  return (
    <div className={classNames(styles.manageUsers, className)} style={style}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>אזור ניהול</div>
          <h1 className={styles.title}>ניהול משתמשים</h1>
          <p className={styles.subtitle}>
            אישור נרשמים חדשים לקהילה, חיפוש חברים ועדכון תפקידים — חבר, כותב, מודרטור ואדמין.
            ניתן גם להעניק "אדמין תוכן" — ניהול כותבים, ספריית הידע והבלוג — בלי הרשאת-על על המערכת
            כולה.
          </p>
          {pendingCount > 0 && (
            <div className={styles.pendingNotice}>
              <Badge variant="warning" showDot>
                {`${pendingCount} ממתינים לאישור`}
              </Badge>
            </div>
          )}
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
          <div className={styles.statusFilters} role="group" aria-label="סינון לפי סטטוס חברות">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={classNames(
                  styles.statusFilter,
                  status === filter.value && styles.statusFilterActive
                )}
                aria-pressed={status === filter.value}
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
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
 * admin panel (RTL) for listing and searching platform users, approving or
 * rejecting pending community members, and changing their role via the role
 * selector. restricted to moderators and admins — they hold the membership
 * gate; signed-out users are redirected and insufficiently privileged users
 * see an access-denied message.
 */
export function ManageUsers({ mockUsers, mockCurrentUser, className, style }: ManageUsersProps) {
  const hasMockCurrentUser = mockCurrentUser !== undefined;

  return (
    <ProtectedRoute
      allowedRoles={[`moderator`, `admin`]}
      mockData={hasMockCurrentUser ? mockCurrentUser : undefined}
    >
      <ManageUsersContent mockUsers={mockUsers} className={className} style={style} />
    </ProtectedRoute>
  );
}
