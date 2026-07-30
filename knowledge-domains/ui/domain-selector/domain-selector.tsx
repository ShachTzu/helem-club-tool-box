import React, { useMemo } from 'react';
import classNames from 'classnames';
import { SelectList, type SelectListOption } from '@helemclub/design.inputs.select-list';
import { useDomains } from '@helemclub/knowledge-domains.hooks.use-domains';
import type { DomainOption } from './domain-option-type.js';
import styles from './domain-selector.module.scss';

export type DomainSelectorProps = {
  /**
   * the selected domain ids.
   */
  value?: string[];

  /**
   * called whenever the selected domain ids change.
   */
  onChange?: (domainIds: string[]) => void;

  /**
   * label rendered above the control.
   */
  label?: string;

  /**
   * helper text rendered below the control, explaining its purpose.
   */
  helperText?: string;

  /**
   * marks the field as required, rendering a visual indicator next to the label.
   */
  required?: boolean;

  /**
   * placeholder text shown when no domain is selected.
   */
  placeholder?: string;

  /**
   * placeholder text for the search input inside the dropdown.
   */
  searchPlaceholder?: string;

  /**
   * maximum number of domains that can be selected at once.
   */
  maxSelections?: number;

  /**
   * renders a summary list of the selected domains below the control.
   */
  showSummary?: boolean;

  /**
   * provide mock domains to skip the network request, useful for tests and previews.
   */
  mockDomains?: DomainOption[];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_VALUE: string[] = [];

/**
 * a multi-select input for tagging content (articles, tools, events, records, gallery items)
 * with one or more knowledge domains. RTL by default.
 */
export function DomainSelector({
  value = DEFAULT_VALUE,
  onChange = () => {},
  label = `תחומי התמודדות`,
  helperText = `בחרו תחום אחד או יותר שרלוונטיים לתוכן שאתם מוסיפים.`,
  required = false,
  placeholder = `בחרו תחומים...`,
  searchPlaceholder = `חיפוש תחום...`,
  maxSelections,
  showSummary = true,
  mockDomains,
  className,
  style,
}: DomainSelectorProps) {
  const { domains, loading, error } = useDomains({ mockData: mockDomains });

  const options: SelectListOption[] = useMemo(
    () =>
      domains.map((domain) => ({
        value: domain.id,
        label: domain.icon ? `${domain.icon} ${domain.name}` : domain.name,
      })),
    [domains]
  );

  const selectedDomains = useMemo(
    () => domains.filter((domain) => value.includes(domain.id)),
    [domains, value]
  );

  const limitReached = Boolean(maxSelections) && value.length >= (maxSelections as number);

  const handleChange = (nextValue: string | string[]) => {
    const nextValues = Array.isArray(nextValue) ? nextValue : [nextValue];
    if (maxSelections && nextValues.length > maxSelections) {
      onChange(nextValues.slice(0, maxSelections));
      return;
    }
    onChange(nextValues);
  };

  return (
    <div className={classNames(styles.container, className)} style={style}>
      <SelectList
        label={required ? `${label} *` : label}
        options={options}
        value={value}
        onChange={(next) => handleChange(next)}
        multiple
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
      />

      {loading && <p className={styles.loadingText}>טוען תחומים...</p>}
      {error && <p className={styles.errorText}>שגיאה בטעינת תחומים: {error}</p>}

      {!loading && !error && helperText && (
        <p className={classNames(styles.helperText, limitReached && styles.limitReached)}>
          {limitReached ? `הגעתם למספר התחומים המרבי (${maxSelections}) שניתן לבחור.` : helperText}
        </p>
      )}

      {showSummary && selectedDomains.length > 0 && (
        <ul className={styles.summary}>
          {selectedDomains.map((domain) => (
            <li key={domain.id} className={styles.summaryChip}>
              {domain.icon && <span className={styles.summaryChipIcon}>{domain.icon}</span>}
              <span>{domain.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
