import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { useSaved, type SaveTarget } from '@helemclub/engagement.hooks.use-saved';
import { BookmarkIcon } from './bookmark-icon.js';
import styles from './save-button.module.scss';

export type SaveButtonSize = `sm` | `md` | `lg`;

export type SaveButtonProps = {
  /**
   * type of the target content being saved (e.g. 'app', 'article', 'event', 'gallery', 'domain').
   */
  targetType: SaveTarget['targetType'];

  /**
   * id of the target content being saved.
   */
  targetId: string;

  /**
   * display title for the saved item, used when rendering a saved list.
   */
  title?: string;

  /**
   * url to navigate to when the saved item is later opened.
   */
  url?: string;

  /**
   * optional display image for the saved item.
   */
  imageUrl?: string;

  /**
   * size of the toggle button.
   */
  size?: SaveButtonSize;

  /**
   * shows the textual label alongside the bookmark icon.
   */
  showLabel?: boolean;

  /**
   * label shown when the item is saved.
   */
  savedLabel?: string;

  /**
   * label shown when the item is not yet saved.
   */
  unsavedLabel?: string;

  /**
   * called after the save state toggles, with the resulting saved state.
   */
  onToggle?: (isSaved: boolean) => void;

  /**
   * overrides the persisted/generated device id. useful for tests and previews.
   */
  mockDeviceId?: string;

  /**
   * class name for the button.
   */
  className?: string;

  /**
   * style for the button.
   */
  style?: React.CSSProperties;
};

const DEFAULT_TITLE = `תוכן שמור`;
const DEFAULT_URL = `/`;

/**
 * a save-for-later bookmark toggle for any content object (app, article,
 * event, gallery item, domain, etc.). the saved state is persisted locally
 * per device, so visitors can build a personal saved list without an account.
 */
export function SaveButton({
  targetType,
  targetId,
  title = DEFAULT_TITLE,
  url = DEFAULT_URL,
  imageUrl,
  size = `md`,
  showLabel = true,
  savedLabel = `נשמר`,
  unsavedLabel = `שמירה למאוחר`,
  onToggle,
  mockDeviceId,
  className,
  style,
}: SaveButtonProps) {
  const { isSaved, toggleSave } = useSaved({ mockDeviceId });
  const saved = isSaved(targetType, targetId);

  const handleClick = useCallback(() => {
    toggleSave({ targetType, targetId, title, url, imageUrl });
    onToggle?.(!saved);
  }, [toggleSave, targetType, targetId, title, url, imageUrl, onToggle, saved]);

  return (
    <Button
      variant={saved ? `accent` : `secondary`}
      size={size}
      leadingIcon={
        <BookmarkIcon
          filled={saved}
          className={classNames(styles.icon, saved && styles.iconSaved)}
        />
      }
      className={classNames(styles.saveButton, className)}
      style={style}
      onClick={() => handleClick()}
    >
      {showLabel && <span className={styles.saveLabel}>{saved ? savedLabel : unsavedLabel}</span>}
    </Button>
  );
}
