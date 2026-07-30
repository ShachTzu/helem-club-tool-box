import React from 'react';
import classNames from 'classnames';
import type { TableColumn } from './table-column-type.js';
import type { TableRow } from './table-row-type.js';
import { mockMemberColumns, mockMemberRows } from './table.mock.js';
import styles from './table.module.scss';

export type TableProps = {
  /**
   * columns configuration describing the header and cell rendering.
   */
  columns?: TableColumn[];

  /**
   * rows of data to render in the table body.
   */
  rows?: TableRow[];

  /**
   * a unique row key field, defaults to `id`.
   */
  rowKey?: string;

  /**
   * message shown when there are no rows to display.
   */
  emptyMessage?: string;

  /**
   * callback fired when a row is clicked.
   */
  onRowClick?: (row: TableRow) => void;

  /**
   * class name for the root wrapper.
   */
  className?: string;

  /**
   * inline style for the root wrapper.
   */
  style?: React.CSSProperties;
};

function getAlignClass(align: TableColumn['align'], variant: 'header' | 'body') {
  if (align === 'center') return variant === 'header' ? styles.headerCellCenter : styles.bodyCellCenter;
  if (align === 'end') return variant === 'header' ? styles.headerCellEnd : styles.bodyCellEnd;
  return undefined;
}

function getCellValue(row: TableRow, column: TableColumn) {
  if (column.renderCell) return column.renderCell(row);
  const value = row[column.key];
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * a responsive RTL data table that renders a standard header/rows layout on wide screens
 * and stacks each row into a card on narrow screens.
 */
export function Table({
  columns = mockMemberColumns,
  rows = mockMemberRows,
  rowKey = `id`,
  emptyMessage = `אין נתונים להצגה`,
  onRowClick,
  className,
  style,
}: TableProps) {
  const mobileColumns = columns.filter((column) => !column.hideOnMobile);

  if (rows.length === 0) {
    return (
      <div className={classNames(styles.tableWrapper, className)} style={style}>
        <div className={styles.emptyState}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.tableWrapper, className)} style={style}>
      <div className={styles.scrollArea}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={classNames(styles.headerCell, getAlignClass(column.align, 'header'))}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const key = row[rowKey] !== undefined ? String(row[rowKey]) : JSON.stringify(row);
              return (
                <tr
                  key={key}
                  className={styles.bodyRow}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={classNames(styles.bodyCell, getAlignClass(column.align, 'body'))}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.mobileList}>
        {rows.map((row) => {
          const key = row[rowKey] !== undefined ? String(row[rowKey]) : JSON.stringify(row);
          return (
            <div
              key={key}
              className={styles.mobileCard}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {mobileColumns.map((column) => (
                <div key={column.key} className={styles.mobileCardRow}>
                  <span className={styles.mobileLabel}>{column.header}</span>
                  <span className={styles.mobileValue}>{getCellValue(row, column)}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
