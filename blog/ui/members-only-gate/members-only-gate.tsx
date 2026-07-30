import React from 'react';
import classNames from 'classnames';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import { Button } from '@helemclub/design.actions.button';
import { Card } from '@helemclub/design.content.card';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import type { MembersOnlyGateUser } from './members-only-gate-user-type.js';
import styles from './members-only-gate.module.scss';

export type MembersOnlyGateProps = {
  /**
   * the members-only content, rendered only when the current viewer is
   * a verified (signed-in) member of the community.
   */
  children?: React.ReactNode;

  /**
   * heading shown to unauthenticated viewers.
   */
  title?: string;

  /**
   * supporting description shown below the title.
   */
  description?: string;

  /**
   * label of the join/login call to action.
   */
  joinLabel?: string;

  /**
   * destination for the join/login button.
   */
  joinHref?: string;

  /**
   * handler invoked when the join/login button is clicked.
   */
  onJoinClick?: () => void;

  /**
   * provide mock data for the current viewer, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
   */
  mockData?: MembersOnlyGateUser | null;

  /**
   * class name for the gate.
   */
  className?: string;

  /**
   * style for the gate.
   */
  style?: React.CSSProperties;
};

/**
 * placeholder shown to unauthenticated viewers for members-only content.
 * renders the wrapped children once the viewer is resolved as a verified
 * community member, otherwise shows an invitation to join or log in. RTL.
 */
export function MembersOnlyGate({
  children,
  title = `התוכן שמור לחברי הקהילה`,
  description = `כדי לצפות בתוכן הזה, יש להצטרף לקהילת הלם קלאב או להתחבר לחשבון קיים. ההצטרפות פתוחה לכל מי שרוצה להיות חלק מהמרחב התומך שלנו.`,
  joinLabel = `הצטרפות / התחברות`,
  joinHref = `/login`,
  onJoinClick,
  mockData,
  className,
  style,
}: MembersOnlyGateProps) {
  const hasMockData = mockData !== undefined;
  const { user, loading } = useAuth(hasMockData ? { mockData } : undefined);

  if (loading) {
    return (
      <div className={classNames(styles.gate, styles.loading, className)} style={style}>
        <span className={styles.loadingText}>טוען נתוני חברות...</span>
      </div>
    );
  }

  if (user) {
    return <div className={classNames(styles.content, className)} style={style}>{children}</div>;
  }

  return (
    <Card padding="large" className={classNames(styles.gate, className)} style={style}>
      <span className={styles.iconBadge}>🔒</span>
      <h3 className={styles.title}>{title}</h3>
      <Paragraph size="md" muted className={styles.description}>
        {description}
      </Paragraph>
      <Button
        variant="accent"
        size="md"
        href={joinHref}
        className={styles.joinButton}
        onClick={() => onJoinClick?.()}
      >
        {joinLabel}
      </Button>
    </Card>
  );
}
