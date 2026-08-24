import React from 'react';
import classNames from 'classnames';
import {
  ApprovalEntry,
  mockApprovalEntries,
  type PlainApprovalEntry,
  type ApprovalAction,
} from '@helemclub/editorial.entities.approval-entry';
import { type PlainRevision, mockRevisions } from '@helemclub/editorial.entities.revision';
import {
  DraftIcon,
  ReviewIcon,
  ApproveIcon,
  RejectIcon,
  ChangesRequestedIcon,
  HistoryIcon,
  PublishIcon,
  RestoreIcon,
} from '@helemclub/editorial.icons.library-icons';
import { Avatar } from '@helemclub/design.content.avatar';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Button } from '@helemclub/design.actions.button';
import styles from './revision-timeline.module.scss';

export type RevisionTimelineProps = {
  /**
   * the immutable revisions (versions) of the draft to render on the timeline.
   */
  revisions?: PlainRevision[];

  /**
   * the approval trail entries (submissions, decisions, publications) of the draft.
   */
  approvals?: PlainApprovalEntry[];

  /**
   * version numbers currently selected for comparison.
   */
  selectedVersions?: number[];

  /**
   * called when a revision item is clicked to be selected or unselected for comparison.
   */
  onSelectVersion?: (versionNumber: number) => void;

  /**
   * called when the "שחזר גרסה זו" button of a revision is clicked.
   */
  onRestore?: (versionNumber: number) => void;

  /**
   * renders a condensed version of the timeline, suitable for a sidebar.
   */
  compact?: boolean;

  /**
   * class name for the timeline root element.
   */
  className?: string;

  /**
   * style for the timeline root element.
   */
  style?: React.CSSProperties;
};

type TimelineEventKind = `revision` | `approval`;

type TimelineEvent = {
  id: string;
  kind: TimelineEventKind;
  createdAt: string;
  actorName: string;
  label: string;
  description?: string;
  versionNumber?: number;
  action?: ApprovalAction;
};

const DEFAULT_REVISIONS: PlainRevision[] = mockRevisions().map((revision) => revision.toObject());
const DEFAULT_APPROVALS: PlainApprovalEntry[] = mockApprovalEntries().map((approval) => approval.toObject());
const DEFAULT_SELECTED_VERSIONS: number[] = [];

const APPROVAL_VISUALS: Record<ApprovalAction, { Icon: typeof DraftIcon; badgeClass: string }> = {
  created: { Icon: DraftIcon, badgeClass: styles.badgeMuted },
  submitted: { Icon: ReviewIcon, badgeClass: styles.badgeInfo },
  changes_requested: { Icon: ChangesRequestedIcon, badgeClass: styles.badgeWarning },
  approved: { Icon: ApproveIcon, badgeClass: styles.badgePositive },
  rejected: { Icon: RejectIcon, badgeClass: styles.badgeNegative },
  published: { Icon: PublishIcon, badgeClass: styles.badgeAccent },
  unpublished: { Icon: RestoreIcon, badgeClass: styles.badgeMuted },
  restored: { Icon: RestoreIcon, badgeClass: styles.badgeAccent },
};

const REVISION_VISUAL = { Icon: HistoryIcon, badgeClass: styles.badgeSecondary };

function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return ``;
  return new Intl.DateTimeFormat(`he-IL`, { dateStyle: `medium`, timeStyle: `short` }).format(date);
}

function buildTimelineEvents(revisions: PlainRevision[], approvals: PlainApprovalEntry[]): TimelineEvent[] {
  const revisionEvents: TimelineEvent[] = revisions.map((revision) => ({
    id: `revision-${revision.id}`,
    kind: `revision`,
    createdAt: revision.createdAt,
    actorName: revision.authorName,
    label: `גרסה ${revision.versionNumber}`,
    description: revision.changeSummary,
    versionNumber: revision.versionNumber,
  }));

  const approvalEvents: TimelineEvent[] = approvals.map((approval) => ({
    id: `approval-${approval.id}`,
    kind: `approval`,
    createdAt: approval.createdAt,
    actorName: approval.actorName,
    label: ApprovalEntry.from(approval).actionLabel(),
    description: approval.note,
    versionNumber: approval.versionNumber,
    action: approval.action,
  }));

  return [...revisionEvents, ...approvalEvents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * a vertical, RTL timeline merging a draft's revisions and approval trail
 * into a single chronological story of who approved what and when.
 */
export function RevisionTimeline({
  revisions = DEFAULT_REVISIONS,
  approvals = DEFAULT_APPROVALS,
  selectedVersions = DEFAULT_SELECTED_VERSIONS,
  onSelectVersion,
  onRestore,
  compact = false,
  className,
  style,
}: RevisionTimelineProps) {
  const events = buildTimelineEvents(revisions, approvals);

  return (
    <div className={classNames(styles.timeline, compact && styles.compact, className)} style={style}>
      {events.map((event, index) => {
        const visual = event.kind === `revision` ? REVISION_VISUAL : APPROVAL_VISUALS[event.action as ApprovalAction];
        const Icon = visual.Icon;
        const isLast = index === events.length - 1;
        const isSelectable = event.kind === `revision` && typeof event.versionNumber === `number`;
        const isSelected = isSelectable && selectedVersions.includes(event.versionNumber as number);

        return (
          <div key={event.id} className={styles.item}>
            <div className={styles.marker}>
              <span className={classNames(styles.badge, visual.badgeClass)}>
                <Icon size={compact ? `small` : `medium`} color="white" />
              </span>
              {!isLast && <span className={styles.line} />}
            </div>
            <div
              className={classNames(
                styles.content,
                isSelectable && styles.selectable,
                isSelected && styles.selected
              )}
              onClick={() => {
                if (isSelectable) onSelectVersion?.(event.versionNumber as number);
              }}
            >
              <div className={styles.header}>
                <div className={styles.actorGroup}>
                  <Avatar name={event.actorName} size={compact ? `small` : `medium`} />
                  <div className={styles.actorMeta}>
                    <span className={styles.actorName}>{event.actorName}</span>
                    <span className={styles.actionLabel}>{event.label}</span>
                  </div>
                </div>
                <span className={styles.date}>{formatEventDate(event.createdAt)}</span>
              </div>
              {!compact && event.description && (
                <Paragraph size="sm" muted className={styles.description}>
                  {event.description}
                </Paragraph>
              )}
              {isSelectable && (
                <div className={styles.actions}>
                  <span className={classNames(styles.selectedTag, isSelected && styles.selectedTagActive)}>
                    {isSelected ? `נבחרה להשוואה ✓` : `לחצו לבחירה להשוואה`}
                  </span>
                  {onRestore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestore(event.versionNumber as number)}
                    >
                      שחזר גרסה זו
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
