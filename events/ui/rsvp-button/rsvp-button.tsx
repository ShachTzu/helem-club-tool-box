import React from 'react';
import classNames from 'classnames';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import { useRsvp, type UseRsvpOptions } from '@helemclub/events.hooks.use-rsvp';
import { Button } from '@helemclub/design.actions.button';
import styles from './rsvp-button.module.scss';

export type RsvpButtonProps = {
  /**
   * id of the event to RSVP for.
   */
  eventId?: string;

  /**
   * called when an anonymous visitor tries to RSVP, should trigger the login flow.
   */
  onLoginRequired?: () => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;

  /**
   * provide mock data for the current user and the event's RSVPs, useful for tests and previews.
   */
  mockData?: UseRsvpOptions['mockData'];
};

/**
 * a toggle button for RSVP-ing to an event. prompts anonymous visitors to log
 * in, and shows the current member's attending state alongside the total
 * number of members attending.
 */
export function RsvpButton({ eventId = ``, onLoginRequired, className, style, mockData }: RsvpButtonProps) {
  const hasMockUser = mockData !== undefined && Object.prototype.hasOwnProperty.call(mockData, `user`);
  const { user, loading: authLoading } = useAuth(hasMockUser ? { mockData: mockData?.user ?? null } : undefined);
  const { attending, rsvpCount, loading, toggling, toggleRsvp } = useRsvp(eventId, mockData ? { mockData } : undefined);

  const isAnonymous = !authLoading && !user;
  const isBusy = loading || toggling;

  const handleClick = () => {
    if (isAnonymous) {
      onLoginRequired?.();
      return;
    }
    toggleRsvp();
  };

  const label = () => {
    if (isAnonymous) return `התחברות לאישור הגעה`;
    if (attending) return `✓ מגיע/ה`;
    return `אני מגיע/ה`;
  };

  return (
    <div className={classNames(styles.rsvpButton, className)} style={style}>
      <Button
        variant={attending ? `secondary` : `accent`}
        size="lg"
        loading={isBusy}
        disabled={!eventId}
        onClick={() => handleClick()}
      >
        {label()}
      </Button>
      <span className={classNames(styles.count, attending && styles.countAttending)}>
        {rsvpCount} נרשמו
      </span>
    </div>
  );
}
