import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import type { SelectListOption } from './select-list-option-type.js';
import { DEFAULT_SELECT_OPTIONS } from './select-list.mock.js';
import styles from './select-list.module.scss';

export type SelectListProps = {
  /**
   * the list of selectable options.
   */
  options?: SelectListOption[];

  /**
   * the selected value(s). a single string in single mode,
   * or an array of strings in multi-select mode.
   */
  value?: string | string[];

  /**
   * called whenever the selection changes.
   * receives a single value in single mode, or an array of values in multi mode.
   */
  onChange?: (value: string | string[]) => void;

  /**
   * enables multi-select behavior with chip display.
   */
  multiple?: boolean;

  /**
   * enables a search input inside the dropdown.
   */
  searchable?: boolean;

  /**
   * an optional label rendered above the control.
   */
  label?: string;

  /**
   * placeholder text shown when no option is selected.
   */
  placeholder?: string;

  /**
   * placeholder text for the search input.
   */
  searchPlaceholder?: string;

  /**
   * text shown when the search yields no matching options.
   */
  noResultsText?: string;

  /**
   * marks the field as required, rendering an indicator next to the label.
   */
  required?: boolean;

  /**
   * error message rendered below the control. when set, the control is
   * styled as invalid.
   */
  error?: string;

  /**
   * helper text rendered below the control, hidden while an error is shown.
   */
  helperText?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

export function SelectList({
  options = DEFAULT_SELECT_OPTIONS,
  value,
  onChange = () => {},
  multiple = false,
  searchable = true,
  label,
  placeholder = `בחרו אפשרות`,
  searchPlaceholder = `חיפוש...`,
  noResultsText = `לא נמצאו תוצאות`,
  required = false,
  error,
  helperText,
  className,
  style,
}: SelectListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(``);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  // true while a pointer press that started inside the control is still being
  // processed, so the resulting blur does not close the dropdown early.
  const pointerInsideRef = useRef(false);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const messageId = `${baseId}-message`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const selectedValues = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    // note: `value` can legitimately be an empty string (e.g. a "none / top-level"
    // option). only exclude it when the prop is genuinely absent (`undefined`) —
    // checking truthiness here would wrongly treat a selected empty-string option
    // as "nothing selected" and leave the trigger stuck on the placeholder.
    return typeof value === `string` ? [value] : [];
  }, [value, multiple]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const normalized = query.trim().toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues]
  );

  const open = () => {
    const firstSelected = filteredOptions.findIndex((option) =>
      selectedValues.includes(option.value)
    );
    setActiveIndex(filteredOptions.length === 0 ? -1 : Math.max(firstSelected, 0));
    setIsOpen(true);
  };

  const close = (refocusTrigger = true) => {
    setIsOpen(false);
    setQuery(``);
    setActiveIndex(-1);
    if (refocusTrigger) triggerRef.current?.focus();
  };

  const toggleOpen = () => {
    if (isOpen) close();
    else open();
  };

  const moveActive = (delta: number) => {
    if (filteredOptions.length === 0) return;
    setActiveIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return filteredOptions.length - 1;
      if (next >= filteredOptions.length) return 0;
      return next;
    });
  };

  const selectSingle = (optionValue: string) => {
    onChange(optionValue);
    close();
  };

  const toggleMultiValue = (optionValue: string) => {
    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((current) => current !== optionValue)
      : [...selectedValues, optionValue];
    onChange(nextValues);
  };

  const removeChip = (optionValue: string) => {
    onChange(selectedValues.filter((current) => current !== optionValue));
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      toggleMultiValue(optionValue);
      return;
    }
    selectSingle(optionValue);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close(false);
      }
    }

    document.addEventListener(`mousedown`, handleClickOutside);
    return () => document.removeEventListener(`mousedown`, handleClickOutside);
  }, [isOpen]);

  // release the pointer guard once the press completes anywhere in the page.
  useEffect(() => {
    function releasePointerGuard() {
      pointerInsideRef.current = false;
    }
    document.addEventListener(`mouseup`, releasePointerGuard);
    document.addEventListener(`touchend`, releasePointerGuard);
    return () => {
      document.removeEventListener(`mouseup`, releasePointerGuard);
      document.removeEventListener(`touchend`, releasePointerGuard);
    };
  }, []);

  // keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    // optional call: jsdom does not implement scrollIntoView.
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: `nearest` });
  }, [isOpen, activeIndex]);

  /**
   * keys shared by the trigger and the search input. Home/End and Space are
   * handled by the trigger only, so they keep their native meaning while typing.
   */
  const handleSharedKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case `ArrowDown`:
      case `ArrowUp`:
        event.preventDefault();
        if (!isOpen) open();
        else moveActive(event.key === `ArrowDown` ? 1 : -1);
        break;
      case `Enter`:
        event.preventDefault();
        if (!isOpen) open();
        else if (activeIndex >= 0) handleOptionClick(filteredOptions[activeIndex].value);
        break;
      case `Escape`:
        if (isOpen) {
          event.preventDefault();
          close();
        }
        break;
      default:
        break;
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case ` `:
        event.preventDefault();
        if (!isOpen) open();
        else if (activeIndex >= 0) handleOptionClick(filteredOptions[activeIndex].value);
        break;
      case `Home`:
      case `End`:
        if (!isOpen || filteredOptions.length === 0) break;
        event.preventDefault();
        setActiveIndex(event.key === `Home` ? 0 : filteredOptions.length - 1);
        break;
      default:
        handleSharedKeyDown(event);
    }
  };

  /**
   * close when focus leaves the whole control, e.g. tabbing past the search
   * input.
   *
   * a pointer press inside the control is ignored here: pressing an option
   * blurs the search input with a null `relatedTarget` (list items are not
   * focusable), and closing on that blur would unmount the option before its
   * click ever fired — which silently swallowed every selection.
   */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    if (pointerInsideRef.current) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    close(false);
  };

  /**
   * flag a pointer press that began inside the control, so the blur it causes
   * is not treated as focus leaving the control.
   */
  const markPointerInside = () => {
    pointerInsideRef.current = true;
  };

  const renderTriggerContent = () => {
    if (multiple) {
      if (selectedOptions.length === 0) {
        return <span className={styles.placeholder}>{placeholder}</span>;
      }
      return (
        <div className={styles.chipsWrapper}>
          {selectedOptions.map((option) => (
            <span key={option.value} className={styles.chip}>
              <span className={styles.chipLabel}>{option.label}</span>
              <button
                type="button"
                className={styles.chipRemove}
                aria-label={`הסרת ${option.label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  removeChip(option.value);
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      );
    }

    if (selectedOptions.length === 0) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
    return <span className={styles.valueText}>{selectedOptions[0].label}</span>;
  };

  return (
    <div
      ref={rootRef}
      className={classNames(styles.container, className)}
      style={style}
      onBlur={handleBlur}
      onMouseDown={markPointerInside}
      onTouchStart={markPointerInside}
    >
      {label && (
        <span className={styles.label} id={labelId}>
          {label}
          {required && (
            <span className={styles.requiredMark} aria-hidden="true">
              {` *`}
            </span>
          )}
        </span>
      )}
      <div
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || helperText ? messageId : undefined}
        className={classNames(styles.trigger, isOpen && styles.triggerOpen, error && styles.triggerError)}
        onClick={() => toggleOpen()}
        onKeyDown={handleTriggerKeyDown}
      >
        {renderTriggerContent()}
        <span className={classNames(styles.caret, isOpen && styles.caretOpen)} aria-hidden="true">
          ▾
        </span>
      </div>

      {isOpen && (
        <div
          className={styles.dropdown}
          // an option <li> isn't focusable, so clicking one blurs the
          // currently-focused trigger/search input first. that fired blur
          // handler closed the dropdown (isOpen -> false) before React
          // delivered the option's own click event, so the click landed on
          // an already-unmounted list and onChange never ran — the
          // selection looked like it "didn't stick". preventing default on
          // mousedown stops the browser from shifting focus away, so the
          // click completes normally and close() runs explicitly afterward.
          onMouseDown={(event) => event.preventDefault()}
        >
          {searchable && (
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={listId}
                aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleSharedKeyDown}
                autoFocus
              />
            </div>
          )}
          <ul
            id={listId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            aria-labelledby={label ? labelId : undefined}
            className={styles.optionsList}
          >
            {filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  className={classNames(
                    styles.option,
                    isSelected && styles.optionSelected,
                    index === activeIndex && styles.optionActive
                  )}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {multiple && (
                    <span
                      className={classNames(
                        styles.optionCheckbox,
                        isSelected && styles.optionCheckboxChecked
                      )}
                      aria-hidden="true"
                    >
                      {isSelected ? `✓` : ``}
                    </span>
                  )}
                  <span className={styles.optionLabel}>{option.label}</span>
                </li>
              );
            })}
          </ul>
          {filteredOptions.length === 0 && (
            <div className={styles.emptyState} role="status">
              {noResultsText}
            </div>
          )}
        </div>
      )}

      {error && (
        <span className={styles.errorText} id={messageId} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className={styles.helperText} id={messageId}>
          {helperText}
        </span>
      )}
    </div>
  );
}
