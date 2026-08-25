import React from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import styles from './pending-approval-notice.module.scss';

export type PendingApprovalNoticeProps = {
  /**
   * the display name of the member awaiting approval, used to personalise
   * the message.
   */
  displayName?: string;

  /**
   * where to send the member so they can browse the read-only content that is
   * already open to them.
   */
  browsePath?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * the screen a new signup sees after completing onboarding, while a moderator
 * or an admin reviews their membership request. explains the wait, sets the
 * expectation that it is a human decision, and points them at the parts of the
 * platform that are already open to them in read-only mode. RTL, Hebrew.
 */
export function PendingApprovalNotice({
  displayName,
  browsePath = `/`,
  className,
  style,
}: PendingApprovalNoticeProps) {
  const greeting = displayName ? `תודה, ${displayName}!` : `תודה על ההרשמה!`;

  return (
    <section
      className={classNames(styles.notice, className)}
      style={style}
      aria-live="polite"
    >
      <div className={styles.badge} aria-hidden="true">
        ⏳
      </div>

      <h1 className={styles.title}>{greeting}</h1>

      <p className={styles.lead}>
        הבקשה שלך להצטרף לקהילה נשלחה לצוות המנהלים. אנחנו עוברים על כל בקשה
        אישית — זה מה ששומר על המרחב הזה בטוח.
      </p>

      <div className={styles.statusRow}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span className={styles.statusLabel}>ממתין לאישור</span>
      </div>

      <p className={styles.body}>
        בינתיים אפשר לקרוא את הבלוג, מאגר הידע והכלים. פרסום תכנים, תגובות
        ותגובות רגשיות ייפתחו ברגע שהחברות תאושר — נעדכן אותך במייל.
      </p>

      <Button variant="primary" href={browsePath}>
        לעיון בתכנים הפתוחים
      </Button>
    </section>
  );
}
