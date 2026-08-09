import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Table, type TableColumn, type TableRow } from '@helemclub/design.content.table';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { ProtectedRoute, type ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';
import {
  useMemberApprovals,
  useMemberProfile,
  type AdminMemberProfile,
  type MembershipStatus,
} from './use-member-approvals.js';
import styles from './approve-members.module.scss';

/**
 * the queue's tabs. `none` is a registered account that never finished
 * onboarding, `rejected` is one an admin declined — both read as
 * "לא חבר קהילה" to the outside world, but an admin needs to tell them apart.
 */
const TABS: { key: MembershipStatus; label: string }[] = [
  { key: `pending`, label: `ממתינים לאישור` },
  { key: `approved`, label: `חברי קהילה` },
  { key: `none`, label: `טרם מילאו פרטים` },
  { key: `rejected`, label: `נדחו` },
];

const GENDER_LABELS: Record<string, string> = {
  female: `נקבה`,
  male: `זכר`,
  other: `אחר`,
};

const RECOGNITION_LABELS: Record<string, string> = {
  recognized: `יש הכרה`,
  'in-process': `בתהליך הכרה`,
  planned: `בכוונה לעשות`,
  none: `אין וגם לא יעשה`,
};

function formatDate(isoDate?: string): string {
  if (!isoDate) return `—`;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString(`he-IL`);
}

export type ApproveMembersProps = {
  /**
   * mock member applications, bypassing the queue query. decisions are applied
   * locally to the mock list. useful for tests and previews.
   */
  mockProfiles?: AdminMemberProfile[];

  /**
   * mock data for the currently signed-in user, bypassing the admin access
   * check. pass null to simulate a signed-out state.
   */
  mockCurrentUser?: ProtectedRouteProps['mockData'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

function ApproveMembersContent({
  mockProfiles,
  className,
  style,
}: Omit<ApproveMembersProps, `mockCurrentUser`>) {
  const [tab, setTab] = useState<MembershipStatus>(`pending`);
  const [query, setQuery] = useState(``);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const hasMock = mockProfiles !== undefined;

  const { profiles, counts, loading, error, setStatus, deciding } = useMemberApprovals(
    hasMock ? { status: tab, query, mockData: mockProfiles } : { status: tab, query }
  );

  const rows: TableRow[] = useMemo(
    () =>
      profiles.map((profile) => ({
        id: profile.userId,
        name: profile.fullName || profile.accountDisplayName || `—`,
        email: profile.contactEmail || profile.accountEmail,
        phone: profile.phone || `—`,
        city: profile.city || `—`,
        submittedAt: profile.submittedAt || profile.createdAt || ``,
      })),
    [profiles]
  );

  const profileById = useMemo(
    () => Object.fromEntries(profiles.map((profile) => [profile.userId, profile])),
    [profiles]
  );

  // the health answers are fetched for the opened applicant only — never for
  // the whole queue. see useMemberProfile.
  const { profile: expanded, loading: expandedLoading } = useMemberProfile(expandedId, mockProfiles);

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: `name`,
        header: `שם`,
        renderCell: (row) => {
          const userId = String(row.id);
          const isExpanded = expandedId === userId;
          return (
            <button
              type="button"
              className={styles.nameButton}
              aria-expanded={isExpanded}
              onClick={() => setExpandedId(isExpanded ? null : userId)}
            >
              <span className={styles.memberName}>{String(row.name)}</span>
              <span className={styles.disclosure}>{isExpanded ? `הסתר פרטים` : `הצג פרטים`}</span>
            </button>
          );
        },
      },
      {
        key: `email`,
        header: `יצירת קשר`,
        hideOnMobile: true,
        renderCell: (row) => {
          const email = String(row.email || ``);
          return email ? <a href={`mailto:${email}`}>{email}</a> : <span>—</span>;
        },
      },
      {
        key: `phone`,
        header: `טלפון`,
        hideOnMobile: true,
        renderCell: (row) => {
          const phone = String(row.phone || ``);
          return phone && phone !== `—` ? <a href={`tel:${phone}`}>{phone}</a> : <span>—</span>;
        },
      },
      { key: `city`, header: `אזור`, hideOnMobile: true },
      {
        key: `submittedAt`,
        header: `נרשמו`,
        hideOnMobile: true,
        renderCell: (row) => formatDate(String(row.submittedAt || ``)),
      },
      {
        key: `actions`,
        header: `החלטה`,
        align: `end`,
        renderCell: (row) => {
          const userId = String(row.id);
          const profile = profileById[userId];
          const isMember = profile?.status === `approved`;
          return (
            <div className={styles.actionsCell}>
              {!isMember && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={deciding || profile?.status === `none`}
                  onClick={() => setStatus(userId, `approved`)}
                >
                  אישור
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                disabled={deciding || profile?.status === `none`}
                onClick={() => setStatus(userId, `rejected`)}
              >
                {isMember ? `ביטול חברות` : `דחייה`}
              </Button>
            </div>
          );
        },
      },
    ],
    [expandedId, profileById, deciding, setStatus]
  );

  return (
    <div className={classNames(styles.approveMembers, className)} style={style}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>אזור ניהול</div>
          <h1 className={styles.title}>אישור חברי קהילה</h1>
          <p className={styles.subtitle}>
            כל מי שנרשם לאתר ומילא את שאלון ההצטרפות ממתין כאן לאישור. אישור הופך אותו לחבר
            קהילה ופותח לו את ארגז הכלים.
          </p>
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={classNames(styles.tab, tab === item.key && styles.tabActive)}
              onClick={() => {
                setTab(item.key);
                setExpandedId(null);
              }}
            >
              {item.label}
              <span className={styles.tabCount}>{counts[item.key] || 0}</span>
            </button>
          ))}
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchField}>
            <TextInput
              placeholder="חיפוש לפי שם או דוא&quot;ל"
              value={query}
              onChange={(value) => setQuery(value)}
            />
          </div>
          <span className={styles.countLabel}>{`${rows.length} רשומות`}</span>
        </div>

        {error ? (
          <div className={styles.errorMessage}>אירעה שגיאה בטעינת רשימת החברים.</div>
        ) : loading ? (
          <div className={styles.stateMessage}>טוען רשימה...</div>
        ) : (
          <Table columns={columns} rows={rows} emptyMessage="אין רשומות בסטטוס הזה" />
        )}

        {expandedId && expandedLoading && (
          <div className={styles.stateMessage}>טוען פרטי מועמד...</div>
        )}

        {expanded && (
          <div className={styles.details}>
            <div className={styles.detailsHead}>
              <h2 className={styles.detailsTitle}>
                {expanded.fullName || expanded.accountDisplayName}
              </h2>
              <span className={styles.detailsMeta}>
                {`נרשמ.ה דרך ${expanded.provider === `google` ? `Google` : `מייל`} · ${
                  expanded.accountEmail
                }`}
              </span>
            </div>

            <dl className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <dt>גיל</dt>
                <dd>{expanded.age || `—`}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>מגדר</dt>
                <dd>{GENDER_LABELS[expanded.gender] || `—`}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>אזור מגורים</dt>
                <dd>{expanded.city || `—`}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>תפקידים בקהילה</dt>
                <dd>{expanded.communityRoles || `—`}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>הכרה בביטוח לאומי / משהב"ט</dt>
                <dd>{RECOGNITION_LABELS[expanded.recognitionStatus] || `—`}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>שיחות וולקאם</dt>
                <dd>{expanded.welcomeCallsOptIn ? `מוכן.ה לקחת` : `לא כרגע`}</dd>
              </div>
              <div className={classNames(styles.detailItem, styles.detailItemWide)}>
                <dt>על הפציעה</dt>
                <dd>{expanded.injuryNote || `—`}</dd>
              </div>
              {expanded.interests.length > 0 && (
                <div className={classNames(styles.detailItem, styles.detailItemWide)}>
                  <dt>תחומי עניין</dt>
                  <dd>{expanded.interests.join(`, `)}</dd>
                </div>
              )}
            </dl>

            <p className={styles.privacyNote}>
              הפרטים כאן כוללים מידע רפואי. הם מוצגים לאדמינים בלבד לצורך החלטת קליטה — לא
              להעתיק, לא להעביר ולא לשמור מחוץ למערכת.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * admin panel (RTL) for approving new community members. lists everyone who
 * registered to the site by membership state, shows the onboarding answers of
 * a selected applicant, and records the approve/decline decision. restricted
 * to admins — the queue carries health data, so the server enforces the same
 * check on every query and mutation.
 */
export function ApproveMembers({
  mockProfiles,
  mockCurrentUser,
  className,
  style,
}: ApproveMembersProps) {
  const hasMockCurrentUser = mockCurrentUser !== undefined;

  return (
    <ProtectedRoute
      allowedRoles={[`admin`]}
      mockData={hasMockCurrentUser ? mockCurrentUser : undefined}
    >
      <ApproveMembersContent mockProfiles={mockProfiles} className={className} style={style} />
    </ProtectedRoute>
  );
}
