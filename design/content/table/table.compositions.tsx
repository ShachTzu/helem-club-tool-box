import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Table } from './table.js';
import type { TableColumn } from './table-column-type.js';
import type { TableRow } from './table-row-type.js';
import { mockMemberColumns, mockMemberRows } from './table.mock.js';

export const BasicTable = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <Table columns={mockMemberColumns} rows={mockMemberRows} />
      </div>
    </MockProvider>
  );
};

const toolColumns: TableColumn[] = [
  { key: `name`, header: `שם הכלי` },
  { key: `category`, header: `קטגוריה`, hideOnMobile: true },
  { key: `submitter`, header: `הוגש ע"י` },
  {
    key: `status`,
    header: `סטטוס`,
    align: `center`,
    renderCell: (row) => {
      const status = String(row.status);
      const tone = status === `אושר` ? '#237a53' : status === `נדחה` ? '#b3261e' : '#b06f1e';
      return <span style={{ color: tone, fontWeight: 700 }}>{status}</span>;
    },
  },
  { key: `submittedAt`, header: `תאריך הגשה`, align: `end`, hideOnMobile: true },
];

const toolRows: TableRow[] = [
  { id: 1, name: `נשימה מודעת`, category: `רגיעה`, submitter: `נועה כהן`, status: `אושר`, submittedAt: `01.03.2024` },
  { id: 2, name: `יומן מצב רוח`, category: `מעקב`, submitter: `איתי לוי`, status: `ממתין`, submittedAt: `14.04.2024` },
  { id: 3, name: `מעגל תמיכה`, category: `קהילה`, submitter: `מאיה ברק`, status: `נדחה`, submittedAt: `22.04.2024` },
  { id: 4, name: `תרגול הארקה`, category: `רגיעה`, submitter: `דניאל שגיא`, status: `אושר`, submittedAt: `02.05.2024` },
];

export const AdminApprovalTable = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <Table columns={toolColumns} rows={toolRows} emptyMessage="אין כלים הממתינים לאישור" />
      </div>
    </MockProvider>
  );
};

export const InteractiveRowSelectionTable = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <p style={{ fontFamily: 'sans-serif', marginBottom: 12 }}>
          שורה נבחרת: {selected ?? 'לא נבחרה שורה'}
        </p>
        <Table
          columns={mockMemberColumns}
          rows={mockMemberRows}
          onRowClick={(row) => setSelected(String(row.name))}
        />
      </div>
    </MockProvider>
  );
};
