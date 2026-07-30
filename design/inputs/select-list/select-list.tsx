import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const rootRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(``);
      }
    }

    document.addEventListener(`mousedown`, handleClickOutside);
    return () => document.removeEventListener(`mousedown`, handleClickOutside);
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) setQuery(``);
  };

  const selectSingle = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setQuery(``);
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
    <div ref={rootRef} className={classNames(styles.container, className)} style={style}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={classNames(styles.trigger, isOpen && styles.triggerOpen)}
        onClick={() => toggleOpen()}
      >
        {renderTriggerContent()}
        <span className={classNames(styles.caret, isOpen && styles.caretOpen)}>▾</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
          )}
          <ul className={styles.optionsList}>
            {filteredOptions.length === 0 && <li className={styles.emptyState}>{noResultsText}</li>}
            {filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={classNames(styles.option, isSelected && styles.optionSelected)}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {multiple && (
                      <span
                        className={classNames(
                          styles.optionCheckbox,
                          isSelected && styles.optionCheckboxChecked
                        )}
                      >
                        {isSelected ? `✓` : ``}
                      </span>
                    )}
                    <span className={styles.optionLabel}>{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
