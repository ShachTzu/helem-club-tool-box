import React, { useState } from 'react';
import classNames from 'classnames';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Tabs, type TabItem } from '@helemclub/design.navigation.tabs';
import {
  type FieldDiff,
  type FieldDiffChangeKind,
  summarizeDiff,
} from '@helemclub/editorial.entities.field-diff';
import {
  beforeCellClassMap,
  afterCellClassMap,
  unifiedItemClassMap,
} from './diff-viewer-change-kind-class-map.js';
import { formatDiffValue } from './diff-viewer-format-value.js';
import styles from './diff-viewer.module.scss';

const viewModeTabs: TabItem[] = [
  { key: `side-by-side`, label: `זה לצד זה` },
  { key: `unified`, label: `מאוחד` },
];

const changeKindLabels: Record<FieldDiffChangeKind, string> = {
  added: `נוסף`,
  removed: `נוסר`,
  modified: `שונה`,
  unchanged: `ללא שינוי`,
};

const defaultDiffs: FieldDiff[] = [];

export type DiffViewerProps = {
  /**
   * list of field diffs to render, describing the changes between two versions.
   */
  diffs?: FieldDiff[];

  /**
   * label describing the source ("before") version, e.g. "גרסה 2".
   */
  fromLabel?: string;

  /**
   * label describing the target ("after") version, e.g. "גרסה 3".
   */
  toLabel?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

export function DiffViewer({
  diffs = defaultDiffs,
  fromLabel = `גרסה קודמת`,
  toLabel = `גרסה נוכחית`,
  className,
  style,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<string>(`side-by-side`);
  const [showUnchanged, setShowUnchanged] = useState(false);

  const changedDiffs = diffs.filter((diff) => diff.changeKind !== `unchanged`);
  const unchangedCount = diffs.length - changedDiffs.length;
  const visibleDiffs = showUnchanged ? diffs : changedDiffs;
  const summary = summarizeDiff(diffs);
  const hasChanges = changedDiffs.length > 0;

  return (
    <div className={classNames(styles.diffViewer, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerTitles}>
          <Heading level={4} align="right">
            השוואת גרסאות
          </Heading>
          <Paragraph size="sm" muted className={styles.summary}>
            {summary} · מ{`־`}{fromLabel} אל {toLabel}
          </Paragraph>
        </div>
        <div className={classNames(styles.tabsWrapper, styles.desktopOnlyTabs)}>
          <Tabs items={viewModeTabs} activeKey={viewMode} onChange={(key) => setViewMode(key)} />
        </div>
      </div>

      <div className={styles.body}>
        {!hasChanges && !showUnchanged && (
          <div className={styles.emptyState}>
            <Heading level={5} align="center" color="muted">
              אין שינויים להצגה
            </Heading>
            <Paragraph size="sm" muted>
              שתי הגרסאות זהות מבחינת התוכן שנבדק.
            </Paragraph>
          </div>
        )}

        {(hasChanges || showUnchanged) && (
          <>
            <div className={classNames(styles.sideBySide, viewMode !== `side-by-side` && styles.mobileHidden)}>
              <div className={styles.column}>
                <div className={styles.columnHeader}>
                  <Heading level={6} align="right">
                    {fromLabel}
                  </Heading>
                </div>
                {visibleDiffs.map((diff) => (
                  <div key={diff.field} className={classNames(styles.fieldRow, beforeCellClassMap[diff.changeKind])}>
                    <span className={styles.fieldLabel}>{diff.label}</span>
                    <span
                      className={classNames(
                        styles.fieldValue,
                        diff.changeKind === `removed` && styles.removedValue,
                        diff.changeKind === `added` && styles.emptyValue
                      )}
                    >
                      {diff.changeKind === `added` ? `ריק` : formatDiffValue(diff.before)}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.column}>
                <div className={styles.columnHeader}>
                  <Heading level={6} align="right">
                    {toLabel}
                  </Heading>
                </div>
                {visibleDiffs.map((diff) => (
                  <div key={diff.field} className={classNames(styles.fieldRow, afterCellClassMap[diff.changeKind])}>
                    <span className={styles.fieldLabel}>{diff.label}</span>
                    <span className={classNames(styles.fieldValue, diff.changeKind === `removed` && styles.emptyValue)}>
                      {diff.changeKind === `removed` ? `ריק` : formatDiffValue(diff.after)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={classNames(styles.unifiedList, viewMode === `side-by-side` && styles.mobileHidden)}>
              {visibleDiffs.map((diff) => (
                <div key={diff.field} className={classNames(styles.unifiedItem, unifiedItemClassMap[diff.changeKind])}>
                  <div className={styles.unifiedItemHeader}>
                    <Heading level={6} align="right">
                      {diff.label}
                    </Heading>
                    <Paragraph size="sm" muted>
                      {changeKindLabels[diff.changeKind]}
                    </Paragraph>
                  </div>
                  <div className={styles.unifiedValues}>
                    <div className={styles.valueRow}>
                      <span className={styles.valueRowLabel}>{fromLabel}:</span>
                      <span
                        className={classNames(
                          styles.valueRowContent,
                          diff.changeKind === `removed` && styles.removedValue,
                          diff.changeKind === `added` && styles.emptyValue
                        )}
                      >
                        {diff.changeKind === `added` ? `ריק` : formatDiffValue(diff.before)}
                      </span>
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.valueRowLabel}>{toLabel}:</span>
                      <span
                        className={classNames(
                          styles.valueRowContent,
                          diff.changeKind === `removed` && styles.emptyValue
                        )}
                      >
                        {diff.changeKind === `removed` ? `ריק` : formatDiffValue(diff.after)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {unchangedCount > 0 && (
        <div className={styles.footer}>
          <button type="button" className={styles.toggleButton} onClick={() => setShowUnchanged(!showUnchanged)}>
            {showUnchanged ? `הסתר שדות שלא השתנו` : `הצג שדות שלא השתנו (${unchangedCount})`}
          </button>
        </div>
      )}
    </div>
  );
}
