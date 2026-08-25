import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { useLabel, type UseLabelOptions } from '@helemclub/knowledge-base.hooks.use-labels';
import { useRecords, type UseRecordsOptions } from '@helemclub/knowledge-base.hooks.use-records';
import { RecordCard } from '@helemclub/knowledge-base.ui.record-card';
import { DomainFilter, type DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';
import styles from './label-lobby.module.scss';

export type LabelLobbyProps = {
  /**
   * base path used to build the link back to the labels lobby, e.g. when the label isn't found.
   */
  labelsLinkBase?: string;

  /**
   * base path used to build links to a domain's lobby page from record cards.
   */
  domainLinkBase?: string;

  /**
   * provide mock label data, skipping the network request. useful for tests and compositions.
   */
  mockLabel?: NonNullable<UseLabelOptions['mockData']>;

  /**
   * provide mock records data, skipping the network request. useful for tests and compositions.
   */
  mockRecords?: NonNullable<UseRecordsOptions['mockData']>;

  /**
   * provide mock domains data for the domain filter, skipping the network request.
   */
  mockDomains?: NonNullable<DomainFilterProps['mockDomains']>;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const EMPTY_SELECTED_DOMAINS: string[] = [];

/**
 * the label lobby page (`/knowledge/:labelSlug`): a label's header and
 * description, followed by a grid of its records with domain filtering. RTL.
 */
export function LabelLobby({
  labelsLinkBase = `/knowledge`,
  domainLinkBase = `/domains`,
  mockLabel,
  mockRecords,
  mockDomains,
  className,
  style,
}: LabelLobbyProps) {
  const { labelSlug } = useParams();
  const [selectedDomains, setSelectedDomains] = useState<string[]>(EMPTY_SELECTED_DOMAINS);

  const { label, loading: labelLoading } = useLabel(labelSlug || ``, { mockData: mockLabel });
  const { records, loading: recordsLoading } = useRecords({
    labelId: label?.id,
    mockData: mockRecords,
  });

  const filteredRecords = useMemo(() => {
    if (selectedDomains.length === 0) return records;
    return records.filter((record) => record.domains.some((domain) => selectedDomains.includes(domain)));
  }, [records, selectedDomains]);

  if (!labelLoading && !label) {
    return (
      <div className={classNames(styles.labelLobby, className)} style={style}>
        <PageLayout>
          <EmptyState
            title="הפרויקט לא נמצא"
            description="ייתכן שהקישור שגוי או שהפרויקט הוסר. חזרו לספריית הידע כדי לבחור פרויקט אחר."
            actionLabel="לכל הפרויקטים"
            actionHref={labelsLinkBase}
          />
        </PageLayout>
      </div>
    );
  }

  return (
    <div className={classNames(styles.labelLobby, className)} style={style}>
      <PageLayout>
        {labelLoading ? (
          <div className={styles.hero}>
            <span className={styles.heroSkeleton} />
          </div>
        ) : (
          <div className={styles.hero}>
            <span className={styles.eyebrow}>פרויקט</span>
            <h1 className={styles.title}>{label?.name}</h1>
            {label?.description && <p className={styles.subtitle}>{label.description}</p>}
          </div>
        )}

        <div className={styles.toolbar}>
          <h2 className={styles.recordsCount}>{`${filteredRecords.length} תכנים`}</h2>
          <div className={styles.domainFilter}>
            <DomainFilter value={selectedDomains} onChange={(value) => setSelectedDomains(value)} mockDomains={mockDomains} />
          </div>
        </div>

        {recordsLoading && (
          <div className={styles.recordsGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {!recordsLoading && filteredRecords.length > 0 && (
          <div className={styles.recordsGrid}>
            {filteredRecords.map((record) => (
              <RecordCard key={record.slug} record={record.toObject()} domainLinkBase={domainLinkBase} />
            ))}
          </div>
        )}

        {!recordsLoading && filteredRecords.length === 0 && (
          <EmptyState
            title="לא נמצאו תכנים"
            description="נסו לשנות את הסינון לפי תחום, או חזרו לבדוק שוב מאוחר יותר."
            actionLabel={selectedDomains.length > 0 ? `איפוס סינון` : undefined}
            onAction={selectedDomains.length > 0 ? () => setSelectedDomains(EMPTY_SELECTED_DOMAINS) : undefined}
          />
        )}
      </PageLayout>
    </div>
  );
}
