import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { LabelCard } from '@helemclub/knowledge-base.ui.label-card';
import { RecordCard } from '@helemclub/knowledge-base.ui.record-card';
import { DomainFilter, type DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';
import { useLabels, type UseLabelsOptions } from '@helemclub/knowledge-base.hooks.use-labels';
import { useRecords } from '@helemclub/knowledge-base.hooks.use-records';
import type { KnowledgeLobbyRecord } from './knowledge-lobby-record-type.js';
import styles from './knowledge-lobby.module.scss';

const DISCOVERY_FEED_LIMIT = 8;
const LABEL_SKELETON_COUNT = 5;
const RECORD_SKELETON_COUNT = 4;

export type KnowledgeLobbyProps = {
  /**
   * base path used to build the link to each label's lobby page, e.g. `${labelLinkBase}/${slug}`.
   */
  labelLinkBase?: string;

  /**
   * base path used to build links to a domain's lobby page from record cards and the filter.
   */
  domainLinkBase?: string;

  /**
   * maximum number of records rendered in the discovery feed.
   */
  feedLimit?: number;

  /**
   * provide mock label data, skipping the network request. useful for tests and compositions.
   */
  mockLabels?: NonNullable<UseLabelsOptions['mockData']>;

  /**
   * provide mock records data for the discovery feed, skipping the network request.
   */
  mockRecords?: KnowledgeLobbyRecord[];

  /**
   * provide mock domains data for the domain filter, skipping the network request.
   */
  mockDomains?: DomainFilterProps['mockDomains'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * the knowledge base lobby (`/knowledge`): the 5 project labels as cards,
 * followed by a domain-filtered discovery feed of recent records across
 * all labels. RTL, responsive.
 */
export function KnowledgeLobby({
  labelLinkBase = `/knowledge`,
  domainLinkBase = `/domains`,
  feedLimit = DISCOVERY_FEED_LIMIT,
  mockLabels,
  mockRecords,
  mockDomains,
  className,
  style,
}: KnowledgeLobbyProps) {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const { labels, loading: labelsLoading } = useLabels({ mockData: mockLabels });

  const { records: fetchedRecords, loading: fetchedRecordsLoading } = useRecords({
    domainIds: selectedDomains.length > 0 ? selectedDomains : undefined,
    limit: feedLimit,
  });

  const records = useMemo(() => {
    if (mockRecords) {
      if (selectedDomains.length === 0) return mockRecords;
      return mockRecords.filter((record) =>
        selectedDomains.some((domain) => (record.domains || []).includes(domain))
      );
    }
    return fetchedRecords.map((record) => record.toObject());
  }, [mockRecords, fetchedRecords, selectedDomains]);

  const recordsLoading = mockRecords ? false : fetchedRecordsLoading;

  return (
    <div className={classNames(styles.knowledgeLobby, className)} style={style}>
      <PageLayout>
        <SectionLayout
          eyebrow="ה-Mother Ship"
          title="מאגר הידע"
          subtitle="סדרות וידאו, הקלטות והרצאות — מאורגנות בפרויקטים ומתויגות לפי תחום. הכל במקום אחד, נגיש בכל רגע."
        />

        <SectionLayout title="הפרויקטים" subtitle="חמש הסדרות המרכזיות של הלם קלאב">
          {labelsLoading ? (
            <div className={styles.labelsGrid}>
              {Array.from({ length: LABEL_SKELETON_COUNT }).map((_, index) => (
                <span key={index} className={styles.skeletonCard} />
              ))}
            </div>
          ) : (
            <div className={styles.labelsGrid}>
              {labels.map((label) => (
                <LabelCard
                  key={label.id}
                  label={label.toObject()}
                  href={`${labelLinkBase}/${label.slug}`}
                />
              ))}
            </div>
          )}
        </SectionLayout>

        <SectionLayout
          title="נוסף לאחרונה"
          subtitle="גלו תכנים חדשים מכל הפרויקטים, וסננו לפי תחום ההתמודדות שמעניין אתכם"
        >
          <div className={styles.filterBar}>
            <DomainFilter
              value={selectedDomains}
              onChange={(value) => setSelectedDomains(value)}
              onlyWithContent
              mockDomains={mockDomains}
            />
          </div>

          {recordsLoading && (
            <div className={styles.recordsGrid}>
              {Array.from({ length: RECORD_SKELETON_COUNT }).map((_, index) => (
                <span key={index} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {!recordsLoading && records.length > 0 && (
            <div className={styles.recordsGrid}>
              {records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  href={`/knowledge/record/${record.slug}`}
                  domainLinkBase={domainLinkBase}
                />
              ))}
            </div>
          )}

          {!recordsLoading && records.length === 0 && (
            <p className={styles.emptyMessage}>לא נמצאו תכנים בתחום שנבחר. נסו לבחור תחום אחר.</p>
          )}
        </SectionLayout>
      </PageLayout>
    </div>
  );
}
