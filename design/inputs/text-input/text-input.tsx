import React, { useId, useState } from 'react';
import classNames from 'classnames';
import styles from './text-input.module.scss';

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'date' | 'number';

export type TextInputProps = {
  /**
   * label rendered above the input.
   */
  label?: string;

  /**
   * placeholder text shown when the input is empty.
   */
  placeholder?: string;

  /**
   * current value of the input, for controlled usage.
   */
  value?: string;

  /**
   * initial value of the input, for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * input type. supports text, email, tel, url, date and number.
   */
  type?: TextInputType;

  /**
   * error message. when set, the input is styled as invalid.
   */
  error?: string;

  /**
   * helper text rendered below the input, hidden when an error is present.
   */
  helperText?: string;

  /**
   * optional icon rendered inside the input, on the leading side.
   */
  icon?: React.ReactNode;

  /**
   * marks the field as required, rendering an indicator next to the label.
   */
  required?: boolean;

  /**
   * disables the input.
   */
  disabled?: boolean;

  /**
   * name attribute of the input.
   */
  name?: string;

  /**
   * id attribute of the input. auto-generated when not provided.
   */
  id?: string;

  /**
   * handler called with the new value whenever the input changes.
   */
  onChange?: (value: string) => void;

  /**
   * class name to override the root container styles.
   */
  className?: string;

  /**
   * style to override the root container styles.
   */
  style?: React.CSSProperties;
};

export function TextInput({
  label,
  placeholder = `הקלד/י כאן...`,
  value,
  defaultValue = ``,
  type = `text`,
  error,
  helperText,
  icon,
  required = false,
  disabled = false,
  name,
  id,
  onChange,
  className,
  style,
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const generatedId = useId();
  const inputId = id || generatedId;
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const hasError = Boolean(error);

  const handleChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}
      <div
        className={classNames(styles.inputContainer, {
          [styles.inputContainerError]: hasError,
          [styles.inputContainerDisabled]: disabled,
        })}
      >
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <input
          id={inputId}
          name={name}
          type={type}
          className={styles.input}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          onChange={(event) => handleChange(event.target.value)}
        />
      </div>
      {hasError ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
