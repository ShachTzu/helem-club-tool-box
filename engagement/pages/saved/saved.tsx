import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Card } from '@helemclub/design.content.card';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { useSaved, type UseSavedOptions } from '@helemclub/engagement.hooks.use-saved';
import type { SavedItem, SavedItemTargetType } from '@helemclub/engagement.entities.saved-item';
import type { SavedTargetTypeLabelMap } from './saved-target-type-label-type.js';
import styles from './saved.module.scss';

const DEFAULT_TARGET_TYPE_LABELS: SavedTargetTypeLabelMap = {
  app: `כלי`,
  article: `כתבה`,
  event: `אירוע`,
  gallery: `גלריה`,
  domain: `תחום התמודדות`,
  other: `תוכן`,
};

const TARGET_TYPE_ICONS: Record<SavedItemTargetType, string> = {
  app: `🧰`,
  article: `📝`,
  event: `📅`,
  gallery: `🎨`,
  domain: `🧭`,
  other: `🔖`,
};

function formatSavedDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString(`he-IL`, { day: `numeric`, month: `long`, year: `numeric` });
  } catch {
    return ``;
  }
}

export type SavedProps = {
  /**
   * hebrew title displayed at the top of the page.
   */
  title?: string;

  /**
   * hebrew subtitle explaining the anonymous, per-device nature of the list.
   */
  subtitle?: string;

  /**
   * label map used to display the type of each saved content object.
   */
  targetTypeLabels?: SavedTargetTypeLabelMap;

  /**
   * link destination shown on the empty-state action button.
   */
  discoverHref?: string;

  /**
   * overrides the persisted/generated device id and saved items list,
   * useful for tests and previews.
   */
  mockOptions?: UseSavedOptions;

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
 * saved-for-later page (/saved). lists the content objects the current
 * device has saved (apps, articles, events, gallery items, domains) as
 * cards, each with an unsave action. works fully anonymously — the list
 * is persisted locally per device, with no account required.
 */
export function Saved({
  title = `השמורים שלי`,
  subtitle = `תוכן ששמרתם לקריאה או צפייה מאוחרת — נשמר על המכשיר שלכם, גם בלי חשבון.`,
  targetTypeLabels = DEFAULT_TARGET_TYPE_LABELS,
  discoverHref = `/toolbox`,
  mockOptions,
  className,
  style,
}: SavedProps) {
  const { savedItems, unsave } = useSaved(mockOptions);

  const handleUnsave = (item: SavedItem) => {
    unsave(item.targetType, item.targetId);
  };

  return (
    <PageLayout className={classNames(styles.saved, className)} style={style}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>שמור למאוחר</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {savedItems.length === 0 ? (
        <EmptyState
          icon={<span className={styles.emptyIcon}>🔖</span>}
          title="עדיין לא שמרתם תוכן"
          description="בכל כתבה, כלי או תוכן תמצאו כפתור שמירה. מה שתשמרו יופיע כאן."
          actionLabel="לגלות תוכן"
          actionHref={discoverHref}
        />
      ) : (
        <div className={styles.grid}>
          {savedItems.map((item) => (
            <Card key={item.id} padding="none" className={styles.card}>
              <Link to={item.url} className={styles.cardLink}>
                <div className={styles.thumb}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className={styles.thumbImage} />
                  ) : (
                    <span className={styles.thumbIcon}>{TARGET_TYPE_ICONS[item.targetType]}</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.typeLabel}>{targetTypeLabels[item.targetType]}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <span className={styles.savedDate}>נשמר בתאריך {formatSavedDate(item.savedAt)}</span>
                </div>
              </Link>
              <button type="button" className={styles.unsaveButton} onClick={() => handleUnsave(item)}>
                <span className={styles.unsaveIcon}>✕</span>
                <span>הסרה מהשמורים</span>
              </button>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
