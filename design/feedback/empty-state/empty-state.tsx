import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { EmptyBoxIcon } from './empty-box-icon.js';
import styles from './empty-state.module.scss';

export type EmptyStateProps = {
  /**
   * icon or illustration slot rendered above the title. defaults to a friendly empty-box illustration.
   */
  icon?: ReactNode;

  /**
   * hebrew title describing the empty state.
   */
  title?: string;

  /**
   * hebrew description explaining why the list or filter returned nothing.
   */
  description?: string;

  /**
   * label for the optional action button. the button renders only when a label and a handler or link are provided.
   */
  actionLabel?: string;

  /**
   * handler invoked when the action button is clicked.
   */
  onAction?: () => void;

  /**
   * route to navigate to when the action button is clicked.
   */
  actionHref?: string;

  /**
   * class name to override the container.
   */
  className?: string;

  /**
   * style to apply to the container.
   */
  style?: React.CSSProperties;
};

/**
 * a friendly empty-state, used when lists or filters return nothing. shows an icon slot,
 * a hebrew title and description, and an optional action button to help the user move forward.
 */
export function EmptyState({
  icon,
  title = `לא נמצאו תוצאות`,
  description = `נסו לשנות את הסינון או את החיפוש, או חזרו לבדוק שוב מאוחר יותר.`,
  actionLabel,
  onAction,
  actionHref,
  className,
  style,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) onAction();
    if (actionHref) navigate(actionHref);
  };

  const showAction = Boolean(actionLabel && (onAction || actionHref));

  return (
    <div className={classNames(styles.emptyState, className)} style={style}>
      <div className={styles.iconWrapper}>{icon || <EmptyBoxIcon className={styles.icon} />}</div>
      <Heading level={3} align="center" className={styles.title}>
        {title}
      </Heading>
      <Paragraph size="md" muted className={styles.description}>
        {description}
      </Paragraph>
      {showAction && (
        <button type="button" className={styles.actionButton} onClick={() => handleAction()}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
