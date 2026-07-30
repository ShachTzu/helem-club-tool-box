import React from 'react';
import classNames from 'classnames';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { useDomains, type UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';
import styles from './domain-filter.module.scss';

export type DomainFilterProps = {
  /**
   * the ids of the currently selected domains. controlled by the parent.
   */
  value?: string[];

  /**
   * called with the updated list of selected domain ids whenever a chip is toggled.
   */
  onChange?: (value: string[]) => void;

  /**
   * when true, only domains with tagged content (count > 0) are rendered.
   */
  onlyWithContent?: boolean;

  /**
   * provide mock domains data to skip the network request, useful for tests and compositions.
   */
  mockDomains?: NonNullable<UseDomainsOptions['mockData']>;

  /**
   * class name for overriding the root container styles.
   */
  className?: string;

  /**
   * style for overriding the root container styles.
   */
  style?: React.CSSProperties;
};

const EMPTY_SELECTION: string[] = [];

/**
 * a reusable, controlled filter bar rendering toggle chips for the coping domains.
 * supports multi-select and can be limited to only domains with tagged content.
 */
export function DomainFilter({
  value = EMPTY_SELECTION,
  onChange,
  onlyWithContent = false,
  mockDomains,
  className,
  style,
}: DomainFilterProps) {
  const { domains, loading } = useDomains({ mockData: mockDomains });

  const toggleDomain = (domainId: string) => {
    const nextValue = value.includes(domainId)
      ? value.filter((id) => id !== domainId)
      : [...value, domainId];
    onChange?.(nextValue);
  };

  const visibleDomains = onlyWithContent ? domains.filter((domain) => domain.count > 0) : domains;

  if (loading) {
    return (
      <div className={classNames(styles.domainFilter, className)} style={style}>
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className={styles.skeletonChip} />
        ))}
      </div>
    );
  }

  if (visibleDomains.length === 0) {
    return (
      <div className={classNames(styles.domainFilter, className)} style={style}>
        <span className={styles.empty}>אין תחומים להצגה</span>
      </div>
    );
  }

  return (
    <div className={classNames(styles.domainFilter, className)} style={style}>
      {visibleDomains.map((domain) => (
        <TagChip
          key={domain.id}
          label={domain.name}
          active={value.includes(domain.id)}
          count={domain.count}
          onToggle={() => toggleDomain(domain.id)}
        />
      ))}
    </div>
  );
}
