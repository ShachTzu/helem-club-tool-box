import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Table } from './table.js';
import type { TableColumn } from './table-column-type.js';
import type { TableRow } from './table-row-type.js';
import styles from './table.module.scss';

const columns: TableColumn[] = [
  { key: `name`, header: `שם` },
  { key: `role`, header: `תפקיד`, hideOnMobile: true },
];

const rows: TableRow[] = [
  { id: 1, name: `נועה כהן`, role: `אדמין` },
  { id: 2, name: `איתי לוי`, role: `מודרטור` },
];

it('should render the column headers', () => {
  const { container } = render(
    <MockProvider>
      <Table columns={columns} rows={rows} />
    </MockProvider>
  );
  const headerCells = container.querySelectorAll(`.${styles.headerCell}`);
  expect(headerCells.length).toBe(columns.length);
  expect(headerCells[0].textContent).toBe('שם');
});

it('should render a row for each data item', () => {
  const { container } = render(
    <MockProvider>
      <Table columns={columns} rows={rows} />
    </MockProvider>
  );
  const bodyRows = container.querySelectorAll(`.${styles.bodyRow}`);
  expect(bodyRows.length).toBe(rows.length);
});

it('should render the empty message when there are no rows', () => {
  const { container } = render(
    <MockProvider>
      <Table columns={columns} rows={[]} emptyMessage="אין נתונים כרגע" />
    </MockProvider>
  );
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState?.textContent).toBe('אין נתונים כרגע');
});

it('should call onRowClick with the clicked row data', () => {
  const clickedRows: TableRow[] = [];
  const { container } = render(
    <MockProvider>
      <Table columns={columns} rows={rows} onRowClick={(row) => clickedRows.push(row)} />
    </MockProvider>
  );
  const bodyRows = container.querySelectorAll(`.${styles.bodyRow}`);
  fireEvent.click(bodyRows[0] as HTMLElement);
  expect(clickedRows.length).toBe(1);
  expect(clickedRows[0].name).toBe(`נועה כהן`);
});

it('should hide mobile-hidden columns in the mobile stacked layout', () => {
  const { container } = render(
    <MockProvider>
      <Table columns={columns} rows={rows} />
    </MockProvider>
  );
  const mobileLabels = container.querySelectorAll(`.${styles.mobileLabel}`);
  const labelTexts = Array.from(mobileLabels).map((label) => label.textContent);
  expect(labelTexts.includes('שם')).toBe(true);
  expect(labelTexts.includes('תפקיד')).toBe(false);
});
