import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { DomainFilter, type DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';
import { useGallery } from '@helemclub/gallery.hooks.use-gallery';
import type { PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { GalleryGrid } from '@helemclub/gallery.ui.gallery-grid';
import { Lightbox } from '@helemclub/gallery.ui.lightbox';
import type { MediaTypeOption } from './media-type-option-type.js';
import styles from './gallery-page.module.scss';

const DEFAULT_MEDIA_TYPE_OPTIONS: MediaTypeOption[] = [
  { value: undefined, label: `הכל` },
  { value: `image`, label: `תמונות` },
  { value: `video`, label: `סרטונים` },
];

export type GalleryPageProps = {
  /**
   * the page heading eyebrow label.
   */
  eyebrow?: string;

  /**
   * the page main title.
   */
  title?: string;

  /**
   * the page subtitle/description.
   */
  subtitle?: string;

  /**
   * the media-type filter options shown above the grid.
   */
  mediaTypeOptions?: MediaTypeOption[];

  /**
   * provide mock gallery items to bypass the network request, useful for tests and previews.
   */
  mockItems?: PlainGalleryItem[];

  /**
   * provide mock domains data for the domain filter, useful for tests and previews.
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

/**
 * the gallery discovery page (`/gallery`): a masonry grid of community
 * artwork with media-type and coping-domain filters, plus a lightbox for
 * viewing a piece full-size with prev/next navigation.
 */
export function GalleryPage({
  eyebrow = `גלריית PTSDART`,
  title = `אמנות מתוך החוויה`,
  subtitle = `גילוי של תמונות ויצירות מהקהילה — ביטוי אישי של ההתמודדות, מתויג לפי תחום.`,
  mediaTypeOptions = DEFAULT_MEDIA_TYPE_OPTIONS,
  mockItems,
  mockDomains,
  className,
  style,
}: GalleryPageProps) {
  const [mediaType, setMediaType] = useState<string | undefined>(undefined);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [openedSlug, setOpenedSlug] = useState<string | null>(null);

  const { items, loading } = useGallery(
    { mediaType, domainIds: selectedDomains },
    { mockData: mockItems }
  );

  const plainItems = useMemo(() => items.map((item) => item.toObject()), [items]);

  const openedIndex = plainItems.findIndex((item) => item.slug === openedSlug);
  const openedItem = openedIndex >= 0 ? plainItems[openedIndex] : undefined;

  const handlePrev = () => {
    if (openedIndex > 0) {
      setOpenedSlug(plainItems[openedIndex - 1].slug);
    }
  };

  const handleNext = () => {
    if (openedIndex >= 0 && openedIndex < plainItems.length - 1) {
      setOpenedSlug(plainItems[openedIndex + 1].slug);
    }
  };

  return (
    <div className={classNames(styles.galleryPage, className)} style={style}>
      <PageLayout>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{loading ? `טוען יצירות…` : `${plainItems.length} יצירות`}</h2>
            <div className={styles.mediaTypeFilter}>
              {mediaTypeOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={classNames(styles.mediaTypeButton, {
                    [styles.mediaTypeButtonActive]: mediaType === option.value,
                  })}
                  onClick={() => setMediaType(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.domainFilterRow}>
            <DomainFilter
              value={selectedDomains}
              onChange={(value) => setSelectedDomains(value)}
              mockDomains={mockDomains}
              onlyWithContent
            />
          </div>
        </div>

        <GalleryGrid items={plainItems} onOpenItem={(slug) => setOpenedSlug(slug)} />
      </PageLayout>

      <Lightbox
        open={Boolean(openedItem)}
        onClose={() => setOpenedSlug(null)}
        item={openedItem}
        hasPrev={openedIndex > 0}
        hasNext={openedIndex >= 0 && openedIndex < plainItems.length - 1}
        onPrev={() => handlePrev()}
        onNext={() => handleNext()}
        currentIndex={openedIndex >= 0 ? openedIndex + 1 : undefined}
        totalCount={plainItems.length}
      />
    </div>
  );
}
