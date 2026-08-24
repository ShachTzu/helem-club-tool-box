import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Card } from '@helemclub/design.content.card';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Avatar } from '@helemclub/design.content.avatar';
import { DomainBadge, type DomainBadgeItem } from '@helemclub/knowledge-domains.ui.domain-badge';
import { DraftStatusBadge } from '@helemclub/editorial.ui.draft-status-badge';
import { mockDrafts, type PlainDraft } from '@helemclub/editorial.entities.draft';
import styles from './draft-card.module.scss';

const DEFAULT_DRAFT: PlainDraft = mockDrafts()[0].toObject();

const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: `פוסט`,
  'media-record': `רשומת מדיה`,
};

function getContentTypeLabel(contentType: string): string {
  return CONTENT_TYPE_LABELS[contentType] || contentType;
}

function toDomainItems(domains: string[]): DomainBadgeItem[] {
  return domains.map((name) => ({ id: name, slug: encodeURIComponent(name), name }));
}

/**
 * formats an ISO timestamp as a hebrew relative time string,
 * e.g. 'לפני שעתיים'.
 */
function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return ``;

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(`he-IL`, { numeric: `auto` });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: `second` },
    { amount: 60, unit: `minute` },
    { amount: 24, unit: `hour` },
    { amount: 7, unit: `day` },
    { amount: 4.34524, unit: `week` },
    { amount: 12, unit: `month` },
    { amount: Number.POSITIVE_INFINITY, unit: `year` },
  ];

  let duration = diffSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return ``;
}

export type DraftCardProps = {
  /**
   * the draft to render on the card.
   */
  draft?: PlainDraft;

  /**
   * base path used to build the link to the draft's detail page,
   * e.g. `${draftLinkBase}/${draft.id}`.
   */
  draftLinkBase?: string;

  /**
   * base path used to build links to each domain's lobby page.
   */
  domainLinkBase?: string;

  /**
   * action buttons rendered at the bottom of the card.
   */
  actions?: React.ReactNode;

  /**
   * class name for the card root element.
   */
  className?: string;

  /**
   * style for the card root element.
   */
  style?: React.CSSProperties;
};

/**
 * a card summarizing a content draft: title, content type, status, author,
 * current version, last update time, related domains, and the last
 * reviewer note when present. clicking the card navigates to the draft's
 * detail page. RTL, responsive.
 */
export function DraftCard({
  draft = DEFAULT_DRAFT,
  draftLinkBase = `/library/draft`,
  domainLinkBase = `/domains`,
  actions,
  className,
  style,
}: DraftCardProps) {
  const navigate = useNavigate();

  const { id, title, contentType, status, authorName, currentVersion, updatedAt, domains, lastReviewNote } = draft;
  const domainItems = toDomainItems(domains || []);
  const updatedLabel = formatRelativeTime(updatedAt);

  const goToDraft = () => navigate(`${draftLinkBase}/${id}`);

  return (
    <Card
      padding="medium"
      clickable
      onClick={() => goToDraft()}
      className={classNames(styles.draftCard, className)}
      style={style}
    >
      <div className={styles.header}>
        <span className={styles.contentType}>{getContentTypeLabel(contentType)}</span>
        <DraftStatusBadge status={status} size="small" />
      </div>

      <Heading level={4} className={styles.title}>
        {title}
      </Heading>

      <div className={styles.metaRow}>
        <div className={styles.authorGroup}>
          <Avatar name={authorName} size="small" />
          <span className={styles.authorName}>{authorName}</span>
        </div>
        <span className={styles.separator}>·</span>
        <span className={styles.version}>{`גרסה ${currentVersion}`}</span>
        {updatedLabel && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.updated}>{`עודכן ${updatedLabel}`}</span>
          </>
        )}
      </div>

      {domainItems.length > 0 && (
        <DomainBadge domains={domainItems} domainLinkBase={domainLinkBase} className={styles.domains} />
      )}

      {lastReviewNote && (
        <div className={styles.reviewNote}>
          <Paragraph size="sm" className={styles.reviewNoteText}>
            {`הערת המנחה: ${lastReviewNote}`}
          </Paragraph>
        </div>
      )}

      {actions && (
        <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
          {actions}
        </div>
      )}
    </Card>
  );
}
