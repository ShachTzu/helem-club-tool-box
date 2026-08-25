import React, { useState } from 'react';
import classNames from 'classnames';
import {
  useApps,
  type UseAppsOptions,
  type ReviewAction,
  type ModeratorMeta,
} from '@helemclub/toolbox.hooks.use-apps';
import { Table, type TableColumn, type TableRow } from '@helemclub/design.content.table';
import { Button } from '@helemclub/design.actions.button';
import { Modal } from '@helemclub/design.overlays.modal';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { ProtectedRoute, type ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';
import styles from './review-submissions.module.scss';

const ACTION_LABELS: Record<string, string> = {
  approve: `אישור`,
  reject: `דחייה`,
  request_changes: `בקשת תיקון`,
  correction: `תיקון הערה`,
};

const STATUS_LABELS: Record<string, string> = {
  rejected: `נדחה`,
  changes_requested: `דורש תיקון`,
};

const NOTE_PROMPTS: Record<string, string> = {
  reject: `למה הכלי לא מתאים לארגז הכלים? ההסבר יישלח למגיש/ה.`,
  request_changes: `מה צריך לתקן לפני פרסום? ההסבר יישלח למגיש/ה.`,
};

const MAX_NOTE_LENGTH = 2000;

/**
 * ponytail: Intl, not a date library. a moderator only needs to know roughly
 * when a decision was made, and the browser already speaks Hebrew dates.
 */
function formatDecisionDate(value: string): string {
  if (!value) return ``;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? `` : date.toLocaleDateString(`he-IL`);
}

/**
 * the tool's identity cell, plus its review trail when it has one. shared by
 * both tables: a resubmitted tool looks identical to a brand new one without
 * it, so the next moderator cannot see that changes were already asked for,
 * or what was asked.
 */
function renderAppCell(row: TableRow, meta: ModeratorMeta) {
  const history = meta[String(row.id)]?.moderationHistory || [];
  return (
    <div className={styles.appCell}>
      <span className={styles.appIcon}>{String(row.icon)}</span>
      <div className={styles.appInfo}>
        <span className={styles.appName}>{String(row.name)}</span>
        <span className={styles.appSubtitle}>{String(row.subtitle)}</span>
        {history.length > 0 && (
          <details className={styles.history}>
            <summary className={styles.historySummary}>
              נבדק כבר {history.length === 1 ? `פעם אחת` : `${history.length} פעמים`}
            </summary>
            <ol className={styles.historyList}>
              {history.map((entry, index) => (
                <li key={`${entry.createdAt}-${index}`} className={styles.historyItem}>
                  <span className={styles.historyAction}>
                    {ACTION_LABELS[entry.action] || entry.action}
                  </span>
                  <span className={styles.historyMeta}>
                    {formatDecisionDate(entry.createdAt)}
                    {entry.moderatorName ? ` · ${entry.moderatorName}` : ``}
                  </span>
                  {entry.note && <span className={styles.historyNote}>{entry.note}</span>}
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * a decision waiting for the moderator to write its note. approvals never
 * open this — only rejecting and requesting changes require an explanation.
 */
type PendingDecision = {
  action: ReviewAction;
  appIds: string[];
};

export type ReviewSubmissionsProps = {
  /**
   * provide mock pending apps to skip the network request, useful for tests and previews.
   */
  mockPendingData?: UseAppsOptions['mockPendingData'];

  /**
   * provide mock decided submissions to skip the network request, useful for
   * tests and previews.
   */
  mockDecidedData?: UseAppsOptions['mockDecidedData'];

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
 * moderation and lets moderators/admins approve, reject or send a submission
 * back for changes — one at a time or as a batch. rejecting and requesting
 * changes require a note, which reaches the submitter by email.
 * restricted to users holding the moderator or admin role, intended to be
 * registered as an AdminPanel in the platform's admin shell.
 */
export function ReviewSubmissions({
  mockPendingData,
  mockDecidedData,
  mockUser,
  className,
  style,
}: ReviewSubmissionsProps) {
  const {
    pendingApps,
    pendingModeratorMeta,
    pendingLoading,
    pendingError,
    reviewApp,
    decidedApps,
    decidedModeratorMeta,
    decidedLoading,
    correctNote,
  } = useApps({ mockPendingData, mockDecidedData });
  const [tab, setTab] = useState<`pending` | `decided`>(`pending`);
  const [correcting, setCorrecting] = useState<{ appId: string; name: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [pendingDecision, setPendingDecision] = useState<PendingDecision | null>(null);
  const [note, setNote] = useState(``);
  const [noteError, setNoteError] = useState(``);
  const [actionError, setActionError] = useState(``);

  const pendingIds = pendingApps.map((app) => app.id);
  const visibleSelectedIds = selectedIds.filter((id) => pendingIds.includes(id));
  const allSelected = pendingIds.length > 0 && visibleSelectedIds.length === pendingIds.length;

  const toggleOne = (appId: string) => {
    setSelectedIds((current) =>
      current.includes(appId) ? current.filter((id) => id !== appId) : [...current, appId]
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : pendingIds);
  };

  const applyDecision = async (action: ReviewAction, appIds: string[], decisionNote: string) => {
    setBusyIds(appIds);
    setActionError(``);
    try {
      const reviewed = await reviewApp({ appIds, action, note: decisionNote || undefined });
      setSelectedIds((current) => current.filter((id) => !appIds.includes(id)));
      // two moderators share this queue, so a batch can partly miss: the
      // server skips anything already decided. say so instead of letting the
      // rows quietly vanish as if every one of them was handled.
      if (reviewed.length > 0 && reviewed.length < appIds.length) {
        setActionError(
          `${reviewed.length} מתוך ${appIds.length} עודכנו. השאר כבר טופלו על ידי מודרטור אחר.`
        );
      }
    } catch (err) {
      setActionError((err as Error).message || `הפעולה נכשלה. נסו שוב.`);
    } finally {
      setBusyIds([]);
    }
  };

  /**
   * approvals run straight away; the two decisions that need an explanation
   * open the note dialog first.
   */
  const startDecision = (action: ReviewAction, appIds: string[]) => {
    if (appIds.length === 0) return;
    if (action === `approve`) {
      void applyDecision(action, appIds, ``);
      return;
    }
    setNote(``);
    setNoteError(``);
    setPendingDecision({ action, appIds });
  };

  const confirmDecision = async () => {
    if (!pendingDecision) return;
    const trimmed = note.trim();
    if (!trimmed) {
      setNoteError(`חובה לכתוב הסבר — הוא נשלח למגיש/ה.`);
      return;
    }
    const { action, appIds } = pendingDecision;
    setPendingDecision(null);
    await applyDecision(action, appIds, trimmed);
  };

  const startCorrection = (appId: string, name: string, currentNote: string) => {
    setNote(currentNote);
    setNoteError(``);
    setCorrecting({ appId, name });
  };

  /**
   * corrects the wording only — the decision itself stays as it was. the
   * member sees the corrected text from now on; the previous wording stays in
   * the submission's history for the team.
   */
  const confirmCorrection = async () => {
    if (!correcting) return;
    const trimmed = note.trim();
    if (!trimmed) {
      setNoteError(`הערה מתוקנת לא יכולה להיות ריקה.`);
      return;
    }
    const { appId } = correcting;
    setCorrecting(null);
    setBusyIds([appId]);
    setActionError(``);
    try {
      await correctNote({ appId, note: trimmed });
    } catch (err) {
      setActionError((err as Error).message || `תיקון ההערה נכשל. נסו שוב.`);
    } finally {
      setBusyIds([]);
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
      key: `select`,
      header: `בחירה`,
      width: `56px`,
      renderCell: (row) => {
        const appId = String(row.id);
        return (
          <input
            type="checkbox"
            className={styles.rowCheckbox}
            checked={selectedIds.includes(appId)}
            onChange={() => toggleOne(appId)}
            aria-label={`בחירת ${String(row.name)} לפעולה מרובה`}
          />
        );
      },
    },
    {
      key: `name`,
      header: `כלי`,
      renderCell: (row) => renderAppCell(row, pendingModeratorMeta),
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
      key: `actions`,
      header: `פעולות`,
      align: `end`,
      renderCell: (row) => {
        const appId = String(row.id);
        const isBusy = busyIds.includes(appId);
        return (
          <div className={styles.actionsCell}>
            <Button
              variant="primary"
              size="sm"
              disabled={isBusy}
              onClick={() => startDecision(`approve`, [appId])}
            >
              {ACTION_LABELS.approve}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isBusy}
              onClick={() => startDecision(`request_changes`, [appId])}
            >
              {ACTION_LABELS.request_changes}
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={isBusy}
              onClick={() => startDecision(`reject`, [appId])}
            >
              {ACTION_LABELS.reject}
            </Button>
          </div>
        );
      },
    },
  ];

  const decidedRows: TableRow[] = decidedApps.map((app) => ({
    id: app.id,
    icon: app.icon,
    name: app.name,
    subtitle: app.subtitle,
    status: app.status || ``,
    moderatorNote: app.moderatorNote || ``,
  }));

  const decidedColumns: TableColumn[] = [
    {
      key: `name`,
      header: `כלי`,
      renderCell: (row) => renderAppCell(row, decidedModeratorMeta),
    },
    {
      key: `status`,
      header: `החלטה`,
      renderCell: (row) => {
        const status = String(row.status || ``);
        return <span>{STATUS_LABELS[status] || status}</span>;
      },
    },
    {
      key: `moderatorNote`,
      header: `ההערה שנשלחה`,
      renderCell: (row) => (
        <span className={styles.currentNote}>{String(row.moderatorNote || `—`)}</span>
      ),
    },
    {
      key: `actions`,
      header: `פעולות`,
      align: `end`,
      renderCell: (row) => {
        const appId = String(row.id);
        return (
          <div className={styles.actionsCell}>
            <Button
              variant="secondary"
              size="sm"
              disabled={busyIds.includes(appId)}
              onClick={() =>
                startCorrection(appId, String(row.name), String(row.moderatorNote || ``))
              }
            >
              תיקון הערה
            </Button>
          </div>
        );
      },
    },
  ];

  const selectionCount = visibleSelectedIds.length;
  const isBatchBusy = busyIds.length > 0;

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

        {/* role=alert: the outcome of a decision must reach a screen reader,
            it is the only feedback that a batch was partly skipped. */}
        {actionError && (
          <div className={styles.errorBanner} role="alert">
            {actionError}
          </div>
        )}

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === `pending`}
            className={classNames(styles.tab, tab === `pending` && styles.tabActive)}
            onClick={() => setTab(`pending`)}
          >
            ממתינות לבדיקה ({pendingApps.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === `decided`}
            className={classNames(styles.tab, tab === `decided` && styles.tabActive)}
            onClick={() => setTab(`decided`)}
          >
            הוחלטו לאחרונה ({decidedApps.length})
          </button>
        </div>

        {tab === `decided` ? (
          decidedLoading ? (
            <div className={styles.stateCard}>
              <div className={styles.stateIcon}>⏳</div>
              <h3 className={styles.stateTitle}>טוענים החלטות אחרונות</h3>
              <p className={styles.stateDescription}>רק רגע.</p>
            </div>
          ) : decidedApps.length === 0 ? (
            <div className={styles.stateCard}>
              <div className={styles.stateIcon}>🗂️</div>
              <h3 className={styles.stateTitle}>אין עדיין החלטות</h3>
              <p className={styles.stateDescription}>
                כלים שנדחו או נשלחו לתיקון יופיעו כאן, ואפשר יהיה לתקן את ההערה שנשלחה.
              </p>
            </div>
          ) : (
            <Table
              columns={decidedColumns}
              rows={decidedRows}
              emptyMessage="אין עדיין החלטות"
            />
          )
        ) : pendingLoading ? (
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
          <>
            <div className={styles.bulkBar}>
              <label className={styles.selectAll}>
                <input
                  type="checkbox"
                  className={styles.rowCheckbox}
                  checked={allSelected}
                  onChange={toggleAll}
                />
                <span>בחירת הכל</span>
              </label>
              <span className={styles.selectionCount}>
                {selectionCount > 0 ? `${selectionCount} נבחרו` : `לא נבחרו הגשות`}
              </span>
              <div className={styles.bulkActions}>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectionCount === 0 || isBatchBusy}
                  onClick={() => startDecision(`approve`, visibleSelectedIds)}
                >
                  {ACTION_LABELS.approve}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selectionCount === 0 || isBatchBusy}
                  onClick={() => startDecision(`request_changes`, visibleSelectedIds)}
                >
                  {ACTION_LABELS.request_changes}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={selectionCount === 0 || isBatchBusy}
                  onClick={() => startDecision(`reject`, visibleSelectedIds)}
                >
                  {ACTION_LABELS.reject}
                </Button>
              </div>
            </div>

            <Table columns={columns} rows={rows} emptyMessage="אין הגשות ממתינות" />
          </>
        )}

        <Modal
          open={Boolean(correcting)}
          onClose={() => setCorrecting(null)}
          size="medium"
          title={correcting ? `תיקון הערה — ${correcting.name}` : ``}
          footer={
            <div className={styles.modalActions}>
              <Button variant="ghost" size="sm" onClick={() => setCorrecting(null)}>
                ביטול
              </Button>
              <Button variant="primary" size="sm" onClick={() => void confirmCorrection()}>
                שמירת התיקון
              </Button>
            </div>
          }
        >
          <p className={styles.modalHint}>
            ההחלטה עצמה לא משתנה. המגיש/ה יראו מעכשיו את הנוסח המתוקן בלבד, ולא יישלח מייל נוסף.
            הנוסח הקודם נשמר בהיסטוריה של ההגשה, לצוות בלבד.
          </p>
          <Textarea
            label="הנוסח המתוקן"
            value={note}
            onChange={(value) => {
              setNote(value);
              if (noteError) setNoteError(``);
            }}
            maxLength={MAX_NOTE_LENGTH}
            error={noteError || undefined}
          />
        </Modal>

        <Modal
          open={Boolean(pendingDecision)}
          onClose={() => setPendingDecision(null)}
          size="medium"
          title={
            pendingDecision
              ? `${ACTION_LABELS[pendingDecision.action]} — ${pendingDecision.appIds.length} הגשות`
              : ``
          }
          footer={
            <div className={styles.modalActions}>
              <Button variant="ghost" size="sm" onClick={() => setPendingDecision(null)}>
                ביטול
              </Button>
              <Button
                variant={pendingDecision?.action === `reject` ? `danger` : `primary`}
                size="sm"
                onClick={() => void confirmDecision()}
              >
                שליחה
              </Button>
            </div>
          }
        >
          <Textarea
            label="הסבר למגיש/ה"
            value={note}
            onChange={(value) => {
              setNote(value);
              if (noteError) setNoteError(``);
            }}
            placeholder={pendingDecision ? NOTE_PROMPTS[pendingDecision.action] : ``}
            maxLength={MAX_NOTE_LENGTH}
            error={noteError || undefined}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
