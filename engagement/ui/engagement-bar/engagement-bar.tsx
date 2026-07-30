import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ReactionBar, type ReactionBarProps, type ReactionOption, type ReactionTargetType } from '@helemclub/engagement.ui.reaction-bar';
import { SaveButton, type SaveButtonProps, type SaveButtonSize } from '@helemclub/engagement.ui.save-button';
import { ShareButtons, type ShareNetwork } from '@helemclub/engagement.ui.share-buttons';
import { useComments, type UseCommentsOptions } from '@helemclub/engagement.hooks.use-comments';
import { CommentIcon } from './comment-icon.js';
import type { EngagementTargetType } from './engagement-target-type.js';
import styles from './engagement-bar.module.scss';

type ReactionSummary = ReactionBarProps['mockData'];
type SaveTargetType = SaveButtonProps['targetType'];
type PlainCommentList = UseCommentsOptions['mockComments'];

export type EngagementBarProps = {
  /**
   * type of content this engagement bar targets (e.g. "post", "app", "event").
   */
  targetType?: EngagementTargetType;

  /**
   * id of the content item this engagement bar targets.
   */
  targetId?: string;

  /**
   * display title for the target content, used for saving and sharing.
   */
  title?: string;

  /**
   * url of the target content, used for saving and sharing.
   */
  url?: string;

  /**
   * optional display image for the target content, used when saving.
   */
  imageUrl?: string;

  /**
   * the selectable reaction options rendered in the reactions section.
   */
  reactionOptions?: ReactionOption[];

  /**
   * size of the save button.
   */
  saveButtonSize?: SaveButtonSize;

  /**
   * called when the comment count button is clicked, useful for scrolling
   * to or opening the comment thread.
   */
  onCommentsClick?: () => void;

  /**
   * called after a share action was completed on a given network.
   */
  onShare?: (network: ShareNetwork) => void;

  /**
   * mock reaction summary, used for previews and tests instead of fetching.
   */
  mockReactions?: ReactionSummary;

  /**
   * mock comments list, used for previews and tests instead of fetching.
   */
  mockComments?: PlainCommentList;

  /**
   * override the persisted device id, useful for tests and previews.
   */
  mockDeviceId?: string;

  /**
   * class name for the engagement bar.
   */
  className?: string;

  /**
   * style for the engagement bar.
   */
  style?: React.CSSProperties;
};

const DEFAULT_TARGET_TYPE: EngagementTargetType = `post`;
const DEFAULT_TARGET_ID = `post-finding-calm-in-the-storm`;
const DEFAULT_TITLE = `הלם קלאב — קהילה, ידע וכלים לחיים לצד פוסט-טראומה`;
const DEFAULT_URL = `https://helam.club`;

function toReactionTargetType(targetType: EngagementTargetType): ReactionTargetType {
  if (
    targetType === `post` ||
    targetType === `record` ||
    targetType === `event` ||
    targetType === `gallery` ||
    targetType === `app` ||
    targetType === `comment`
  ) {
    return targetType;
  }

  return `post`;
}

function toSaveTargetType(targetType: EngagementTargetType): SaveTargetType {
  if (
    targetType === `app` ||
    targetType === `article` ||
    targetType === `event` ||
    targetType === `gallery` ||
    targetType === `domain`
  ) {
    return targetType;
  }

  return `other`;
}

/**
 * a composite engagement bar combining reactions, save-for-later, share and
 * comment count for a single piece of content. drop it into any content
 * detail page with a targetType and targetId. RTL by default.
 */
export function EngagementBar({
  targetType = DEFAULT_TARGET_TYPE,
  targetId = DEFAULT_TARGET_ID,
  title = DEFAULT_TITLE,
  url = DEFAULT_URL,
  imageUrl,
  reactionOptions,
  saveButtonSize = `md`,
  onCommentsClick,
  onShare,
  mockReactions,
  mockComments,
  mockDeviceId,
  className,
  style,
}: EngagementBarProps) {
  const navigate = useNavigate();
  const { comments } = useComments(targetType, targetId, {
    mockComments,
    mockDeviceId,
  });

  const handleCommentsClick = () => {
    if (onCommentsClick) {
      onCommentsClick();
      return;
    }

    navigate(url);
  };

  return (
    <div className={classNames(styles.engagementBar, className)} style={style}>
      <div className={styles.primaryActions}>
        <ReactionBar
          targetType={toReactionTargetType(targetType)}
          targetId={targetId}
          options={reactionOptions}
          mockData={mockReactions}
          mockDeviceId={mockDeviceId}
          showTotal={false}
        />
        <button type="button" className={styles.commentButton} onClick={() => handleCommentsClick()}>
          <span className={styles.commentIcon}>
            <CommentIcon />
          </span>
          <span className={styles.commentLabel}>
            <span className={styles.commentCount}>{comments.length}</span> תגובות
          </span>
        </button>
        <SaveButton
          targetType={toSaveTargetType(targetType)}
          targetId={targetId}
          title={title}
          url={url}
          imageUrl={imageUrl}
          size={saveButtonSize}
          mockDeviceId={mockDeviceId}
        />
      </div>
      <div className={styles.shareSection}>
        <ShareButtons url={url} title={title} onShare={(network) => onShare?.(network)} />
      </div>
    </div>
  );
}
