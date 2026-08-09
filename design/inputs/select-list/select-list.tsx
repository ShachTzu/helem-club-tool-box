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
  className,
  style,
}: SelectListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(``);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const selectedValues = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    return typeof value === `string` && value ? [value] : [];
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

  /** close when focus leaves the whole control, e.g. tabbing past the search input. */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    close(false);
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
    >
      {label && (
        <span className={styles.label} id={labelId}>
          {label}
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
        className={classNames(styles.trigger, isOpen && styles.triggerOpen)}
        onClick={() => toggleOpen()}
        onKeyDown={handleTriggerKeyDown}
      >
        {renderTriggerContent()}
        <span className={classNames(styles.caret, isOpen && styles.caretOpen)} aria-hidden="true">
          ▾
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
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
    </div>
  );
}
