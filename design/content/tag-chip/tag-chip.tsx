import React from 'react';
import classNames from 'classnames';
import { RemoveIcon } from './remove-icon.js';
import styles from './tag-chip.module.scss';

export type TagChipProps = {
  /**
   * the label text of the coping-domain tag.
   */
  label?: string;

  /**
   * marks the chip as active/selected. renders in amber when true.
   */
  active?: boolean;

  /**
   * an optional count suffix, shown next to the label (e.g. amount of items tagged with this domain).
   */
  count?: number;

  /**
   * renders a remove ("x") affordance and calls `onRemove` when clicked.
   */
  removable?: boolean;

  /**
   * disables interaction with the chip.
   */
  disabled?: boolean;

  /**
   * called when the chip is clicked/toggled. when provided, the chip renders as an interactive control.
   */
  onToggle?: () => void;

  /**
   * called when the remove affordance is clicked. only relevant when `removable` is true.
   */
  onRemove?: () => void;

  /**
   * class name for overriding the chip container styles.
   */
  className?: string;

  /**
   * style for overriding the chip container styles.
   */
  style?: React.CSSProperties;
};

export function TagChip({
  label = `תחום התמודדות`,
  active = false,
  count,
  removable = false,
  disabled = false,
  onToggle,
  onRemove,
  className,
  style,
}: TagChipProps) {
  const isInteractive = Boolean(onToggle) && !disabled;
  const rootClassName = classNames(
    styles.chip,
    active && styles.active,
    isInteractive && styles.interactive,
    disabled && styles.disabled,
    className
  );

  const content = (
    <>
      <span className={styles.label}>{label}</span>
      {typeof count === 'number' && <span className={styles.count}>{count}</span>}
      {removable && (
        <button
          type="button"
          className={styles.removeButton}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.();
          }}
          aria-label={`הסר ${label}`}
        >
          <RemoveIcon />
        </button>
      )}
    </>
  );

  if (onToggle) {
    return (
      <button
        type="button"
        className={rootClassName}
        style={style}
        disabled={disabled}
        onClick={() => onToggle()}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={rootClassName} style={style}>
      {content}
    </span>
  );
}
