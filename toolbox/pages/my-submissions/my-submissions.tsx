import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { ProtectedRoute, type ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';
import {
  useListMySubmissions,
  type UseListMySubmissionsOptions,
} from '@helemclub/toolbox.hooks.use-apps';
import styles from './my-submissions.module.scss';

const STATUS_TABS = [
  { key: `all`, label: `הכל` },
  { key: `draft`, label: `טיוטות` },
  { key: `pending`, label: `ממתין לאישור` },
  { key: `changes_requested`, label: `דורש תיקון` },
  { key: `approved`, label: `פורסם` },
  { key: `rejected`, label: `נדחה` },
];

const STATUS_LABEL: Record<string, string> = {
  draft: `טיוטה`,
  pending: `ממתין לאישור`,
  changes_requested: `דורש תיקון`,
  approved: `פורסם`,
  rejected: `נדחה`,
};

export type MySubmissionsProps = {
  /**
   * provide mock submissions to skip the network request, useful for tests and previews.
   */
  mockData?: UseListMySubmissionsOptions['mockData'];

  /**
   * provide a mock signed-in user to bypass the auth check. pass null for signed-out.
   */
  mockUser?: ProtectedRouteProps['mockData'];

  /**
   * base path of the submit form, used for "continue editing" and empty-state links.
   */
  submitHref?: string;

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
 * "my submissions" page: a signed-in member sees their own submitted tools
 * grouped by status, and can resume drafts or tools returned for fixes. the
 * server returns only the member's own records. RTL.
 */
export function MySubmissions({
  mockData,
  mockUser,
  submitHref = `/toolbox/submit`,
  className,
  style,
}: MySubmissionsProps) {
  const { apps, loading } = useListMySubmissions({ mockData });
  const [tab, setTab] = useState<string>(`all`);

  const items = useMemo(() => apps.map((app) => app.toObject()), [apps]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: items.length };
    items.forEach((item) => {
      result[item.status] = (result[item.status] || 0) + 1;
    });
    return result;
  }, [items]);

  const visible = tab === `all` ? items : items.filter((item) => item.status === tab);

  return (
    <ProtectedRoute mockData={mockUser}>
      <div className={classNames(styles.page, className)} style={style}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>האזור שלי</span>
          <h1 className={styles.title}>ההגשות שלי</h1>
          <p className={styles.subtitle}>הכלים שהגשת לארגז הכלים, והסטטוס של כל אחד.</p>
        </div>

        <div className={styles.tabs}>
          {STATUS_TABS.map((statusTab) => (
            <button
              key={statusTab.key}
              type="button"
              className={classNames(styles.tab, tab === statusTab.key && styles.tabActive)}
              onClick={() => setTab(statusTab.key)}
            >
              {statusTab.label}
              {counts[statusTab.key] ? ` (${counts[statusTab.key]})` : ``}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.state}>טוענים את ההגשות שלך…</div>
        ) : visible.length === 0 ? (
          <div className={styles.state}>
            <p className={styles.stateText}>
              עוד לא הגשת כלים{tab !== `all` ? ` בסטטוס הזה` : ``}.
            </p>
            <Link to={submitHref} className={styles.cta}>
              ➕ הגשת כלי
            </Link>
          </div>
        ) : (
          <ul className={styles.list}>
            {visible.map((item) => {
              const editable = item.status === `draft` || item.status === `changes_requested`;
              return (
                <li key={item.id} className={styles.card}>
                  <span className={styles.icon}>{item.icon || `🧩`}</span>
                  <div className={styles.info}>
                    <span className={styles.name}>{item.name || `ללא שם`}</span>
                    {item.subtitle && <span className={styles.sub}>{item.subtitle}</span>}
                  </div>
                  <span className={classNames(styles.badge, styles[`badge_${item.status}`])}>
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                  {editable ? (
                    <Link to={`${submitHref}?id=${item.id}`} className={styles.action}>
                      המשך עריכה
                    </Link>
                  ) : item.status === `approved` ? (
                    <Link to={`/toolbox/${item.slug}`} className={styles.actionGhost}>
                      צפייה
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
