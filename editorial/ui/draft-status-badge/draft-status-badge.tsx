import React from 'react';
import classNames from 'classnames';
import { Badge, type BadgeVariant } from '@helemclub/design.content.badge';
import type { DraftStatus } from '@helemclub/editorial.entities.draft';
import {
  DraftIcon,
  ReviewIcon,
  ChangesRequestedIcon,
  ApproveIcon,
  PublishIcon,
  LibraryIcon,
} from '@helemclub/editorial.icons.library-icons';
import type { LibraryIconProps } from '@helemclub/editorial.icons.library-icons';
import styles from './draft-status-badge.module.scss';

export type DraftStatusBadgeSize = 'small' | 'medium' | 'large';

export type DraftStatusBadgeProps = {
  /**
   * current status of the draft to display.
   */
  status: DraftStatus;

  /**
   * size of the badge and its icon.
   */
  size?: DraftStatusBadgeSize;

  /**
   * renders the matching status icon before the label.
   */
  showIcon?: boolean;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

type StatusConfig = {
  label: string;
  variant: BadgeVariant;
  icon: (props: LibraryIconProps) => React.JSX.Element;
  extraClassName?: string;
};

const statusConfigMap: Record<DraftStatus, StatusConfig> = {
  draft: {
    label: `טיוטה`,
    variant: 'neutral',
    icon: DraftIcon,
  },
  in_review: {
    label: `בביקורת`,
    variant: 'accent',
    icon: ReviewIcon,
  },
  changes_requested: {
    label: `נדרשו תיקונים`,
    variant: 'warning',
    icon: ChangesRequestedIcon,
  },
  approved: {
    label: `אושר`,
    variant: 'success',
    icon: ApproveIcon,
  },
  published: {
    label: `פורסם`,
    variant: 'neutral',
    icon: PublishIcon,
    extraClassName: styles.published,
  },
  archived: {
    label: `בארכיון`,
    variant: 'neutral',
    icon: LibraryIcon,
    extraClassName: styles.archived,
  },
};

const iconSizeBySize: Record<DraftStatusBadgeSize, LibraryIconProps['size']> = {
  small: 'small',
  medium: 'small',
  large: 'medium',
};

/**
 * a status badge for a draft, mapping a DraftStatus to a hebrew label,
 * a color and a matching icon. RTL by default.
 */
export function DraftStatusBadge({ status, size = `medium`, showIcon = true, className, style }: DraftStatusBadgeProps) {
  const config = statusConfigMap[status];
  const StatusIcon = config.icon;
  const iconSize = iconSizeBySize[size];

  return (
    <Badge
      variant={config.variant}
      className={classNames(styles.draftStatusBadge, styles[size], config.extraClassName, className)}
      style={style}
    >
      {showIcon && <StatusIcon size={iconSize} color="current" className={styles.icon} />}
      <span className={styles.label}>{config.label}</span>
    </Badge>
  );
}
