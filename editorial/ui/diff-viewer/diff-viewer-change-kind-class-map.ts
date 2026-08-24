import type { FieldDiffChangeKind } from '@helemclub/editorial.entities.field-diff';
import styles from './diff-viewer.module.scss';

/**
 * maps a field diff change kind to the css module class used for the
 * "before" cell in the side-by-side view.
 */
export const beforeCellClassMap: Record<FieldDiffChangeKind, string> = {
  added: styles.beforeEmpty,
  removed: styles.removed,
  modified: styles.modified,
  unchanged: styles.unchanged,
};

/**
 * maps a field diff change kind to the css module class used for the
 * "after" cell in the side-by-side view.
 */
export const afterCellClassMap: Record<FieldDiffChangeKind, string> = {
  added: styles.added,
  removed: styles.afterEmpty,
  modified: styles.modified,
  unchanged: styles.unchanged,
};

/**
 * maps a field diff change kind to the css module class used for a full
 * item in the unified view.
 */
export const unifiedItemClassMap: Record<FieldDiffChangeKind, string> = {
  added: styles.added,
  removed: styles.removed,
  modified: styles.modified,
  unchanged: styles.unchanged,
};
