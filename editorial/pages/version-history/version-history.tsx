import React, { useMemo, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Link } from '@helemclub/design.navigation.link';
import { Button } from '@helemclub/design.actions.button';
import { Modal } from '@helemclub/design.overlays.modal';
import { Spinner } from '@helemclub/design.loaders.spinner';
import { RevisionTimeline } from '@helemclub/editorial.ui.revision-timeline';
import { DiffViewer } from '@helemclub/editorial.ui.diff-viewer';
import { useDraft } from '@helemclub/editorial.hooks.use-drafts';
import { useRevisions, useDiff, useRestoreRevision } from '@helemclub/editorial.hooks.use-revisions';
import { useApprovalTrail } from '@helemclub/editorial.hooks.use-approvals';
import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import { Revision, type PlainRevision } from '@helemclub/editorial.entities.revision';
import type { PlainApprovalEntry } from '@helemclub/editorial.entities.approval-entry';
import {
  FieldDiff,
  diffPayloads,
  type PlainFieldDiff,
} from '@helemclub/editorial.entities.field-diff';
import type { VersionHistoryUser } from './version-history-user-type.js';
import styles from './version-history.module.scss';

export type VersionHistoryProps = {
  /**
   * base path of the draft editor, the version number-less editor route
   * this page links back to.
   */
  editorBasePath?: string;

  /**
   * provide a mock signed-in user, bypassing the auth query. useful for
   * tests and compositions.
   */
  mockUser?: VersionHistoryUser;

  /**
   * provide a mock draft, bypassing the GraphQL query.
   */
  mockDraft?: PlainDraft | null;

  /**
   * provide mock revisions, bypassing the GraphQL query.
   */
  mockRevisions?: PlainRevision[];

  /**
   * provide mock approval trail entries, bypassing the GraphQL query.
   */
  mockApprovals?: PlainApprovalEntry[];

  /**
   * provide mock field diffs for the currently selected versions, bypassing
   * the GraphQL query.
   */
  mockDiffs?: PlainFieldDiff[];

  /**
   * simulates a loading state, regardless of the underlying data.
   */
  mockLoading?: boolean;

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
 * a page rendering the full version history of a draft: a merged timeline
 * of revisions and approval events, alongside a field-level diff of the two
 * selected versions, with the ability to restore a past revision.
 */
export function VersionHistory({
  editorBasePath = `/library/draft`,
  mockUser,
  mockDraft,
  mockRevisions: mockRevisionsData,
  mockApprovals,
  mockDiffs,
  mockLoading = false,
  className,
  style,
}: VersionHistoryProps) {
  const { id: draftId = `` } = useParams<{ id: string }>();

  const hasMockDraft = mockDraft !== undefined;
  const { draft, loading: draftLoading } = useDraft(draftId, hasMockDraft ? { mockData: mockDraft } : undefined);

  const { revisions, loading: revisionsLoading } = useRevisions(
    draftId,
    mockRevisionsData ? { mockData: mockRevisionsData.map((revision) => Revision.from(revision)) } : undefined
  );

  const { entries: approvals, loading: approvalsLoading } = useApprovalTrail(
    draftId,
    mockApprovals ? { mockData: mockApprovals } : undefined
  );

  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
  const [restoreCandidate, setRestoreCandidate] = useState<number | undefined>(undefined);

  const { restoreRevision, restoring } = useRestoreRevision();

  /**
   * the two latest version numbers, used as the default comparison when the
   * user has not explicitly picked two versions on the timeline.
   */
  const defaultVersions = useMemo(() => {
    const sorted = [...revisions].sort((a, b) => a.versionNumber - b.versionNumber);
    return sorted.slice(-2).map((revision) => revision.versionNumber);
  }, [revisions]);

  const activeVersions =
    selectedVersions.length === 2 ? selectedVersions.slice().sort((a, b) => a - b) : undefined;

  const comparedVersions = activeVersions || defaultVersions;

  const fromVersion = comparedVersions[0] ?? 0;
  const toVersion = comparedVersions[1] ?? 0;

  /**
   * when the page is previewed or tested with mock revisions, the diff is
   * computed locally from the two compared revision payloads instead of
   * round-tripping to the server.
   */
  const localDiffs = useMemo(() => {
    if (mockDiffs) return mockDiffs.map((diff) => FieldDiff.from(diff));
    if (!mockRevisionsData) return undefined;
    const before = revisions.find((revision) => revision.versionNumber === fromVersion);
    const after = revisions.find((revision) => revision.versionNumber === toVersion);
    return diffPayloads(before?.payload || {}, after?.payload || {}).map((diff) =>
      FieldDiff.from(diff)
    );
  }, [mockDiffs, mockRevisionsData, revisions, fromVersion, toVersion]);

  const { diffs, loading: diffLoading } = useDiff(
    draftId,
    fromVersion,
    toVersion,
    localDiffs ? { mockData: localDiffs } : undefined
  );

  const toggleVersion = (versionNumber: number) => {
    setSelectedVersions((current) =>
      current.includes(versionNumber)
        ? current.filter((version) => version !== versionNumber)
        : [...current, versionNumber].slice(-2)
    );
  };

  const handleRestoreClick = (versionNumber: number) => {
    setRestoreCandidate(versionNumber);
  };

  const handleConfirmRestore = async () => {
    if (restoreCandidate === undefined) return;
    await restoreRevision({ draftId, versionNumber: restoreCandidate });
    setRestoreCandidate(undefined);
  };

  const isLoading = mockLoading || draftLoading || revisionsLoading || approvalsLoading;
  const hasEnoughRevisions = revisions.length >= 2;
  const draftTitle = draft?.title || `טיוטה`;
  const editorHref = `${editorBasePath}/${draftId}`;

  return (
    <ProtectedRoute allowedRoles={[`writer`, `moderator`, `admin`]} mockData={mockUser}>
      <PageLayout className={classNames(styles.page, className)} style={style}>
        <div className={styles.header}>
          <div className={styles.headerTitles}>
            <Heading level={2} align="right">
              היסטוריית גרסאות
            </Heading>
            <Paragraph size="md" muted>
              {draftTitle}
            </Paragraph>
          </div>
          <Link as={RouterLink} href={editorHref} className={styles.backLink}>
            חזרה לעורך
          </Link>
        </div>

        {isLoading && (
          <div className={styles.loadingState}>
            <Spinner size="large" message="טוענים את היסטוריית הגרסאות..." />
          </div>
        )}

        {!isLoading && revisions.length === 0 && (
          <div className={styles.emptyState}>
            <Heading level={4} align="center" color="muted">
              אין עדיין היסטוריית גרסאות
            </Heading>
            <Paragraph size="sm" muted>
              ברגע שיישמרו עדכונים לטיוטה זו, הם יופיעו כאן כציר זמן מלא.
            </Paragraph>
          </div>
        )}

        {!isLoading && revisions.length > 0 && (
          <div className={styles.layout}>
            <div className={styles.timelineColumn}>
              <RevisionTimeline
                revisions={revisions.map((revision) => revision.toObject())}
                approvals={approvals.map((entry) => entry.toObject())}
                selectedVersions={comparedVersions}
                onSelectVersion={(versionNumber) => toggleVersion(versionNumber)}
                onRestore={(versionNumber) => handleRestoreClick(versionNumber)}
              />
            </div>

            <div className={styles.diffColumn}>
              {!hasEnoughRevisions && (
                <div className={styles.hint}>
                  <Paragraph size="sm" muted>
                    נדרשות לפחות שתי גרסאות כדי להציג השוואה.
                  </Paragraph>
                </div>
              )}

              {hasEnoughRevisions && !diffLoading && (
                <DiffViewer
                  diffs={diffs}
                  fromLabel={`גרסה ${fromVersion}`}
                  toLabel={`גרסה ${toVersion}`}
                />
              )}

              {hasEnoughRevisions && diffLoading && (
                <div className={styles.loadingState}>
                  <Spinner size="medium" message="טוענים השוואה..." />
                </div>
              )}
            </div>
          </div>
        )}
      </PageLayout>

      <Modal
        open={restoreCandidate !== undefined}
        onClose={() => setRestoreCandidate(undefined)}
        title="שחזור גרסה"
        size="small"
        footer={
          <div className={styles.modalActions}>
            <Button variant="ghost" onClick={() => setRestoreCandidate(undefined)}>
              ביטול
            </Button>
            <Button variant="primary" loading={restoring} onClick={() => handleConfirmRestore()}>
              שחזר גרסה
            </Button>
          </div>
        }
      >
        <div className={styles.modalBody}>
          <Paragraph size="md">
            {`שחזור גרסה ${restoreCandidate ?? ``} ייצור גרסה חדשה בראש ציר הזמן, על בסיס התוכן שהיה שמור בה.`}
          </Paragraph>
          <Paragraph size="sm" muted>
            הפעולה אינה מוחקת ואינה משנה אף גרסה קיימת — כל ההיסטוריה נשמרת במלואה.
          </Paragraph>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
