import React from 'react';
import classNames from 'classnames';
import {
  ROADMAP,
  CRITICAL_PATH,
  roadmapSummary,
  type RoadmapItem,
  type ItemStatus,
  type ItemPriority,
} from './roadmap-data.js';
import styles from './plan-to-production.module.scss';

export type PlanToProductionProps = {
  /**
   * class name for overriding the root container styles.
   */
  className?: string;
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  done: 'הושלם',
  partial: 'חלקי',
  missing: 'חסר',
};

const PRIORITY_LABEL: Record<ItemPriority, string> = {
  critical: 'קריטי',
  high: 'גבוה',
  medium: 'בינוני',
  low: 'נמוך',
};

const STATUS_BADGE: Record<ItemStatus, string> = {
  done: styles.badgeDone,
  partial: styles.badgePartial,
  missing: styles.badgeMissing,
};

const STATUS_CARD: Record<ItemStatus, string> = {
  done: styles.cardDone,
  partial: styles.cardPartial,
  missing: styles.cardMissing,
};

const PRIORITY_BADGE: Record<ItemPriority, string> = {
  critical: styles.badgeCritical,
  high: styles.badgeHigh,
  medium: styles.badgeMedium,
  low: styles.badgeLow,
};

/**
 * renders a single roadmap item as a status card, showing current state,
 * recommendation and the areas it touches.
 */
function ItemCard({ item }: { item: RoadmapItem }) {
  return (
    <article className={classNames(styles.card, STATUS_CARD[item.status])}>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <div className={styles.badges}>
          <span className={classNames(styles.badge, PRIORITY_BADGE[item.priority])}>
            {PRIORITY_LABEL[item.priority]}
          </span>
          <span className={classNames(styles.badge, STATUS_BADGE[item.status])}>
            {STATUS_LABEL[item.status]}
          </span>
        </div>
      </header>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>מה קיים היום</span>
        <p className={styles.fieldValue}>{item.current}</p>
      </div>

      <div className={styles.recommendation}>
        <span className={styles.fieldLabel}>המלצה</span>
        <p className={styles.fieldValue}>{item.recommendation}</p>
      </div>

      <div className={styles.areas}>
        {item.areas.map((area) => (
          <span key={area} className={styles.area}>
            {area}
          </span>
        ))}
      </div>
    </article>
  );
}

/**
 * The Plan-to-Production page: a living, prioritized comparison between the
 * original Helam Club plan and what is actually built today. Groups every
 * capability and gap by area, shows an overall progress summary, and lays out
 * the recommended critical path to production. Serves as shared context for
 * both the team and the AI when completing development. Fully RTL, Hebrew.
 */
export function PlanToProduction({ className }: PlanToProductionProps) {
  const summary = roadmapSummary();
  const donePct = Math.round((summary.done / summary.total) * 100);
  const partialPct = Math.round((summary.partial / summary.total) * 100);
  const missingPct = 100 - donePct - partialPct;

  return (
    <div className={classNames(styles.page, className)} dir="rtl">
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>מהתוכנית לפרודקשן</h1>
        <p className={styles.heroSubtitle}>
          מפת דרכים חיה: השוואה מסודרת בין התוכנית המקורית של הלם קלאב לבין מה שנבנה בפועל,
          עם המלצות מתועדפות להשלמת הפיתוח.
        </p>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNumber}>{summary.total}</span>
            <span className={styles.summaryLabel}>סה״כ יכולות</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNumber}>{summary.done}</span>
            <span className={styles.summaryLabel}>הושלמו</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNumber}>{summary.partial}</span>
            <span className={styles.summaryLabel}>חלקיים</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNumber}>{summary.missing}</span>
            <span className={styles.summaryLabel}>חסרים</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNumber}>{summary.critical}</span>
            <span className={styles.summaryLabel}>קריטיים</span>
          </div>
        </div>

        <div
          className={styles.progressBar}
          role="img"
          aria-label={`${donePct}% הושלם, ${partialPct}% חלקי, ${missingPct}% חסר`}
        >
          <div className={styles.progressDone} style={{ width: `${donePct}%` }} />
          <div className={styles.progressPartial} style={{ width: `${partialPct}%` }} />
          <div className={styles.progressMissing} style={{ width: `${missingPct}%` }} />
        </div>
      </header>

      <section className={styles.criticalPath}>
        <h2 className={styles.sectionHeading}>🎯 המסלול הקריטי לפרודקשן</h2>
        <ol className={styles.pathList}>
          {CRITICAL_PATH.map((step) => (
            <li key={step.order} className={styles.pathItem}>
              <span className={styles.pathNumber}>{step.order}</span>
              <div className={styles.pathBody}>
                <p className={styles.pathTitle}>{step.title}</p>
                <p className={styles.pathWhy}>{step.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {ROADMAP.map((section) => (
        <section key={section.id} className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span>{section.icon}</span>
            {section.title}
          </h2>
          <p className={styles.sectionSummary}>{section.summary}</p>
          <div className={styles.cards}>
            {section.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
