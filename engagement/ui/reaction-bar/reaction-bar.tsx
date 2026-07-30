import React, { useEffect, useState, type CSSProperties } from 'react';
import classNames from 'classnames';
import { useReactions, type ReactionCount, type ReactionSummary } from '@helemclub/engagement.hooks.use-reactions';
import type { ReactionOption, ReactionTargetType } from './reaction-option-type.js';
import styles from './reaction-bar.module.scss';

const DEFAULT_OPTIONS: ReactionOption[] = [
  { type: `like`, emoji: `👍`, label: `אהבתי` },
  { type: `heart`, emoji: `❤️`, label: `נגעת בלב` },
  { type: `hug`, emoji: `🤗`, label: `חיבוק` },
  { type: `star`, emoji: `⭐`, label: `מעולה` },
];

export type ReactionBarProps = {
  /**
   * type of content this reaction bar targets (e.g. "post", "event").
   */
  targetType?: ReactionTargetType;

  /**
   * id of the content item this reaction bar targets.
   */
  targetId?: string;

  /**
   * the selectable reaction options rendered in the bar.
   */
  options?: ReactionOption[];

  /**
   * whether to render the sum of all reaction counts next to the options.
   */
  showTotal?: boolean;

  /**
   * mock reaction summary, used for previews and tests instead of fetching.
   */
  mockData?: ReactionSummary;

  /**
   * override the persisted device id, useful for tests and previews.
   */
  mockDeviceId?: string;

  /**
   * class name for the reaction bar.
   */
  className?: string;

  /**
   * inline style for the reaction bar.
   */
  style?: CSSProperties;
};

function getCount(counts: ReactionCount[], type: string): number {
  const found = counts.find((current) => current.type === type);
  return found?.count || 0;
}

function applyOptimisticToggle(
  counts: ReactionCount[],
  myReaction: string | undefined,
  type: string
): { counts: ReactionCount[]; myReaction?: string } {
  const nextCounts: ReactionCount[] = counts.map((current) => ({ ...current }));

  const bump = (target: string, delta: number) => {
    const existing = nextCounts.find((current) => current.type === target);
    if (existing) {
      existing.count = Math.max(0, (existing.count || 0) + delta);
    } else if (delta > 0) {
      nextCounts.push({ type: target, count: delta });
    }
  };

  if (myReaction === type) {
    bump(type, -1);
    return { counts: nextCounts, myReaction: undefined };
  }

  if (myReaction) {
    bump(myReaction, -1);
  }
  bump(type, 1);
  return { counts: nextCounts, myReaction: type };
}

/**
 * a like + emoji reaction bar showing counts per reaction type, allowing
 * a single reaction per device with an optimistic toggle. RTL by default.
 */
export function ReactionBar({
  targetType = `post`,
  targetId = `post-finding-calm-in-the-storm`,
  options = DEFAULT_OPTIONS,
  showTotal = true,
  mockData,
  mockDeviceId,
  className,
  style,
}: ReactionBarProps) {
  const { counts, totalCount, myReaction, toggling, error, toggleReaction } = useReactions(targetType, targetId, {
    mockData,
    mockDeviceId,
  });

  const [optimistic, setOptimistic] = useState<{ counts: ReactionCount[]; myReaction?: string } | null>(null);
  const [bumpedType, setBumpedType] = useState<string | undefined>(undefined);

  useEffect(() => {
    setOptimistic(null);
  }, [counts, myReaction]);

  const displayCounts = optimistic ? optimistic.counts : counts;
  const displayMyReaction = optimistic ? optimistic.myReaction : myReaction;
  const displayTotal = displayCounts.reduce((sum, current) => sum + (current.count || 0), 0);

  const handleToggle = (type: string) => {
    if (toggling) return;
    const next = applyOptimisticToggle(displayCounts, displayMyReaction, type);
    setOptimistic(next);
    setBumpedType(type);
    toggleReaction(type).catch(() => setOptimistic(null));
  };

  return (
    <div className={classNames(styles.reactionBar, className)} style={style}>
      {options.map((option) => {
        const isActive = displayMyReaction === option.type;
        const count = getCount(displayCounts, option.type);

        return (
          <button
            key={option.type}
            type="button"
            title={option.label}
            disabled={toggling}
            className={classNames(styles.option, isActive && styles.active, toggling && styles.disabled)}
            onClick={() => handleToggle(option.type)}
          >
            <span
              className={classNames(styles.emoji, bumpedType === option.type && styles.bump)}
              onAnimationEnd={() => setBumpedType(undefined)}
            >
              {option.emoji}
            </span>
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
      {showTotal && <span className={styles.totalCount}>{displayTotal || totalCount} תגובות בסך הכול</span>}
      {error && <span className={styles.errorMessage}>{`לא ניתן היה לעדכן את התגובה כרגע`}</span>}
    </div>
  );
}
