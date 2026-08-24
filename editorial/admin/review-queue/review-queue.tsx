import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Table, type TableColumn, type TableRow } from '@helemclub/design.content.table';
import { Tabs } from '@helemclub/design.navigation.tabs';
import { Modal } from '@helemclub/design.overlays.modal';
import { SelectList } from '@helemclub/design.inputs.select-list';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { Spinner } from '@helemclub/design.loaders.spinner';
import { DraftStatusBadge } from '@helemclub/editorial.ui.draft-status-badge';
import { ReviewActions } from '@helemclub/editorial.ui.review-actions';
import { DiffViewer } from '@helemclub/editorial.ui.diff-viewer';
import { ReviewIcon } from '@helemclub/editorial.icons.library-icons';
import { useDrafts, type UseDraftsOptions } from '@helemclub/editorial.hooks.use-drafts';
import { useApprovalTrail } from '@helemclub/editorial.hooks.use-approvals';
import { diffPayloads } from '@helemclub/editorial.entities.field-diff';
import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import type { PlainApprovalEntry } from '@helemclub/editorial.entities.approval-entry';
import type { ReviewQueueUser } from './review-queue-user-type.js';
import { waitingLabel, isOverdue } from './waiting-time.js';
import styles from './review-queue.module.scss';

type ReviewQueueTabKey = 'pending' | 'decided';

export type ReviewQueueProps = {
  /**
   * provide mock drafts awaiting review, bypassing the GraphQL query.
   */
  mockPendingDrafts?: PlainDraft[];

  /**
   * provide mock approval entries for the "recently decided" tab.
   */
  mockDecisions?: PlainApprovalEntry[];

  /**
   * provide a mock signed-in user, bypassing the auth query.
   */
  mockUser?: ReviewQueueUser | null;

  /**
   * simulates a loading state.
   */
  mockLoading?: boolean;

  /**
   * fixes "now" for deterministic waiting-time rendering in tests.
   */
  now?: Date;

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
 * the moderator review queue: every draft waiting for a decision, sorted by
 * how long it has been waiting, with the drafts that waited too long
 * highlighted. clicking a row opens a review modal showing the content, the
 * changes since the last approved version, and the approve / request-changes
 * / reject actions.
 */
export function ReviewQueue({
  mockPendingDrafts,
  mockDecisions,
  mockUser,
  mockLoading = false,
  now,
  className,
  style,
}: ReviewQueueProps) {
  return (
    <ProtectedRoute
      allowedRoles={['moderator', 'admin']}
      mockData={mockUser === null ? undefined : (mockUser as never)}
    >
      <ReviewQueueContent
        mockPendingDrafts={mockPendingDrafts}
        mockDecisions={mockDecisions}
        mockUser={mockUser}
        mockLoading={mockLoading}
        now={now}
        className={className}
        style={style}
      />
    </ProtectedRoute>
  );
}

function ReviewQueueContent({
  mockPendingDrafts,
  mockDecisions,
  mockUser,
  mockLoading,
  now,
  className,
  style,
}: ReviewQueueProps) {
  const [activeTab, setActiveTab] = useState<ReviewQueueTabKey>('pending');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [selectedDraftId, setSelectedDraftId] = useState<string | undefined>(undefined);

  const hasMockDrafts = mockPendingDrafts !== undefined;
  const draftsOptions: UseDraftsOptions = hasMockDrafts
    ? { status: ['in_review'], mockData: mockPendingDrafts }
    : { status: ['in_review'], limit: 50 };
  const { drafts, loading } = useDrafts(draftsOptions);

  const { entries: decisions } = useApprovalTrail(
    '',
    mockDecisions !== undefined ? { mockData: mockDecisions } : undefined
  );

  const contentTypeOptions = useMemo(() => {
    const unique = Array.from(new Set(drafts.map((draft) => draft.contentType)));
    return [
      { value: 'all', label: 'כל סוגי התוכן' },
      ...unique.map((type) => ({ value: type, label: contentTypeLabel(type) })),
    ];
  }, [drafts]);

  /**
   * the pending drafts, filtered by content type and sorted oldest first —
   * the drafts that waited the longest are the ones a moderator should see
   * at the top.
   */
  const queue = useMemo(() => {
    const filtered =
      contentTypeFilter === 'all'
        ? drafts
        : drafts.filter((draft) => draft.contentType === contentTypeFilter);

    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.submittedAt || a.updatedAt).getTime();
      const bTime = new Date(b.submittedAt || b.updatedAt).getTime();
      return aTime - bTime;
    });
  }, [drafts, contentTypeFilter]);

  const selectedDraft = useMemo(
    () => queue.find((draft) => draft.id === selectedDraftId),
    [queue, selectedDraftId]
  );

  const columns: TableColumn[] = [
    { key: 'title', header: 'כותרת' },
    { key: 'contentType', header: 'סוג תוכן', hideOnMobile: true },
    { key: 'authorName', header: 'מחבר' },
    { key: 'version', header: 'גרסה', align: 'center', hideOnMobile: true },
    {
      key: 'waiting',
      header: 'זמן המתנה',
      align: 'end',
      renderCell: (row: TableRow) => (
        <span className={classNames(styles.waiting, row.overdue && styles.waitingOverdue)}>
          {row.waiting}
        </span>
      ),
    },
  ];

  const rows: TableRow[] = queue.map((draft) => ({
    id: draft.id,
    title: draft.title,
    contentType: contentTypeLabel(draft.contentType),
    authorName: draft.authorName,
    version: `גרסה ${draft.currentVersion}`,
    waiting: waitingLabel(draft.submittedAt, now),
    overdue: isOverdue(draft.submittedAt, now),
  }));

  const decisionColumns: TableColumn[] = [
    { key: 'actorName', header: 'מנחה' },
    { key: 'action', header: 'החלטה' },
    { key: 'note', header: 'הערה', hideOnMobile: true },
    { key: 'date', header: 'תאריך', align: 'end' },
  ];

  const decisionRows: TableRow[] = decisions
    .filter((entry) => entry.isDecision)
    .map((entry) => ({
      id: entry.id,
      actorName: entry.actorName,
      action: entry.actionLabel(),
      note: entry.note || '—',
      date: new Date(entry.createdAt).toLocaleDateString('he-IL'),
    }));

  /**
   * the field-level content of the draft under review, rendered as a diff
   * against an empty baseline so the moderator sees every field at once.
   */
  const reviewDiffs = useMemo(() => {
    if (!selectedDraft) return [];
    return diffPayloads({}, selectedDraft.payload);
  }, [selectedDraft]);

  const isLoading = Boolean(mockLoading) || loading;

  return (
    <div className={classNames(styles.queue, className)} style={style}>
      <PageLayout>
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <ReviewIcon size="small" />
            שכבת העריכה
          </span>
          <Heading level={1} className={styles.title}>
            תור ביקורת
          </Heading>
          <Paragraph className={styles.subtitle}>
            כל הטיוטות שממתינות להחלטה, מהוותיקה לחדשה. טיוטה שממתינה יותר משבוע מסומנת באדום.
          </Paragraph>
        </div>

        <Tabs
          items={[
            { key: 'pending', label: `ממתינות (${queue.length})` },
            { key: 'decided', label: 'הוכרעו לאחרונה' },
          ]}
          activeKey={activeTab}
          onChange={(key: string) => setActiveTab(key as ReviewQueueTabKey)}
        />

        {activeTab === 'pending' && (
          <div className={styles.panel}>
            <div className={styles.filterRow}>
              <SelectList
                label="סינון לפי סוג תוכן"
                options={contentTypeOptions}
                value={contentTypeFilter}
                onChange={(value) => setContentTypeFilter(Array.isArray(value) ? value[0] : value)}
              />
            </div>

            {isLoading && (
              <div className={styles.stateBlock}>
                <Spinner />
                <Paragraph className={styles.loadingText}>טוענים את תור הביקורת...</Paragraph>
              </div>
            )}

            {!isLoading && rows.length === 0 && (
              <div className={styles.stateBlock}>
                <EmptyState
                  title="אין טיוטות שממתינות לביקורת"
                  description="כל מה שנשלח כבר הוכרע. ברגע שכותב ישלח טיוטה חדשה, היא תופיע כאן."
                />
              </div>
            )}

            {!isLoading && rows.length > 0 && (
              <Table
                columns={columns}
                rows={rows}
                onRowClick={(row: TableRow) => setSelectedDraftId(String(row.id))}
              />
            )}
          </div>
        )}

        {activeTab === 'decided' && (
          <div className={styles.panel}>
            {decisionRows.length === 0 ? (
              <div className={styles.stateBlock}>
                <EmptyState
                  title="עדיין לא נרשמו החלטות"
                  description="כל אישור, דחייה או דרישת תיקונים יתועדו כאן, עם שם המנחה והתאריך."
                />
              </div>
            ) : (
              <Table columns={decisionColumns} rows={decisionRows} />
            )}
          </div>
        )}
      </PageLayout>

      <Modal
        open={Boolean(selectedDraft)}
        onClose={() => setSelectedDraftId(undefined)}
        title={selectedDraft ? selectedDraft.title : 'ביקורת טיוטה'}
        size="large"
      >
        {selectedDraft && (
          <div className={styles.reviewModal}>
            <div className={styles.reviewMeta}>
              <DraftStatusBadge status={selectedDraft.status} />
              <span className={styles.reviewMetaItem}>{selectedDraft.authorName}</span>
              <span className={styles.reviewMetaItem}>
                {contentTypeLabel(selectedDraft.contentType)}
              </span>
              <span className={styles.reviewMetaItem}>גרסה {selectedDraft.currentVersion}</span>
            </div>

            <DiffViewer diffs={reviewDiffs} fromLabel="הגרסה שאושרה" toLabel="הגרסה שנשלחה" />

            <ReviewActions
              draft={selectedDraft.toObject()}
              mockUser={mockUser as never}
              onDone={() => setSelectedDraftId(undefined)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

/**
 * a Hebrew label for a content type key, falling back to the key itself for
 * content types the queue does not know about.
 */
function contentTypeLabel(contentType: string): string {
  const labels: Record<string, string> = {
    post: 'מאמר בבלוג',
    'media-record': 'רשומת מדיה',
    tool: 'כלי התמודדות',
    event: 'אירוע',
    'gallery-item': 'פריט גלריה',
  };
  return labels[contentType] || contentType;
}
