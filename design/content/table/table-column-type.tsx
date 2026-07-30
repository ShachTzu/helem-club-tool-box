import type { ReactNode } from 'react';
import type { TableRow } from './table-row-type.js';

/**
 * configuration for a single table column.
 */
export type TableColumn = {
  /**
   * the key of the row field to render in this column.
   */
  key: string;

  /**
   * the column header label.
   */
  header: string;

  /**
   * optional custom cell renderer, receives the full row.
   */
  renderCell?: (row: TableRow) => ReactNode;

  /**
   * text alignment of the column content.
   */
  align?: 'start' | 'center' | 'end';

  /**
   * hide this column in the mobile stacked layout.
   */
  hideOnMobile?: boolean;

  /**
   * a fixed width for the column, e.g. `120px` or `20%`.
   */
  width?: string;
};
