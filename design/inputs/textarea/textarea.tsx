import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import styles from './textarea.module.scss';

export type TextareaProps = {
  /**
   * the label text displayed above the textarea.
   */
  label?: string;

  /**
   * the current value of the textarea.
   */
  value?: string;

  /**
   * placeholder text shown when the textarea is empty.
   */
  placeholder?: string;

  /**
   * callback fired when the textarea value changes.
   */
  onChange?: (value: string) => void;

  /**
   * error message to display below the textarea. when set, the textarea
   * is rendered in an error state.
   */
  error?: string;

  /**
   * helper text displayed below the textarea when there is no error.
   */
  helperText?: string;

  /**
   * maximum number of characters allowed. when set, a character counter
   * is displayed.
   */
  maxLength?: number;

  /**
   * whether the textarea should automatically grow to fit its content.
   */
  autoGrow?: boolean;

  /**
   * minimum number of visible text rows.
   */
  minRows?: number;

  /**
   * maximum number of visible text rows before scrolling.
   */
  maxRows?: number;

  /**
   * marks the field as required, appending a visual indicator to the label.
   */
  required?: boolean;

  /**
   * disables the textarea.
   */
  disabled?: boolean;

  /**
   * unique id for the textarea element, used to bind the label.
   */
  id?: string;

  /**
   * name attribute for the textarea element.
   */
  name?: string;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * inline style for the root container.
   */
  style?: React.CSSProperties;
};

let instanceCount = 0;

function getNextId() {
  instanceCount += 1;
  return `helam-textarea-${instanceCount}`;
}

export function Textarea({
  label,
  value,
  placeholder = `כתבו כאן...`,
  onChange,
  error,
  helperText,
  maxLength,
  autoGrow = true,
  minRows = 3,
  maxRows = 10,
  required,
  disabled,
  id,
  name,
  className,
  style,
}: TextareaProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(``);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(id || getNextId());

  const currentValue = value !== undefined ? value : uncontrolledValue;

  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!node || !autoGrow) return;

    node.style.height = `auto`;
    const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight || `24`) || 24;
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    const nextHeight = Math.min(Math.max(node.scrollHeight, minHeight), maxHeight);
    node.style.height = `${nextHeight}px`;
  }, [currentValue, autoGrow, minRows, maxRows]);

  const handleChange = (nextValue: string) => {
    const clipped = maxLength ? nextValue.slice(0, maxLength) : nextValue;
    if (value === undefined) setUncontrolledValue(clipped);
    onChange?.(clipped);
  };

  const showCounter = Boolean(maxLength);
  const isNearLimit = Boolean(maxLength) && currentValue.length > (maxLength as number) - 60;

  return (
    <div className={classNames(styles.container, className)} style={style}>
      {label && (
        <label htmlFor={idRef.current} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={idRef.current}
        name={name}
        value={currentValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        rows={minRows}
        disabled={disabled}
        className={classNames(styles.textarea, {
          [styles.error]: Boolean(error),
          [styles.disabled]: disabled,
        })}
      />
      <div className={styles.footer}>
        <span className={styles.message}>
          {error ? (
            <span className={styles.errorText}>{error}</span>
          ) : (
            helperText && <span className={styles.helperText}>{helperText}</span>
          )}
        </span>
        {showCounter && (
          <span className={classNames(styles.counter, { [styles.counterWarn]: isNearLimit })}>
            {currentValue.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
