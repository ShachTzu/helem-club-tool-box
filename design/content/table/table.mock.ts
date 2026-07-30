import type { TableRow } from './table-row-type.js';
import type { TableColumn } from './table-column-type.js';

export const mockMemberColumns: TableColumn[] = [
  { key: `name`, header: `שם מלא` },
  { key: `email`, header: `דוא"ל`, hideOnMobile: true },
  { key: `role`, header: `תפקיד` },
  { key: `status`, header: `סטטוס`, align: `center` },
  { key: `joined`, header: `הצטרפות`, align: `end`, hideOnMobile: true },
];

export const mockMemberRows: TableRow[] = [
  { id: 1, name: `נועה כהן`, email: `noa.cohen@helamclub.co.il`, role: `אדמין`, status: `פעיל`, joined: `12.01.2023` },
  { id: 2, name: `איתי לוי`, email: `itay.levi@helamclub.co.il`, role: `מודרטור`, status: `פעיל`, joined: `03.05.2023` },
  { id: 3, name: `מאיה ברק`, email: `maya.barak@helamclub.co.il`, role: `כותבת`, status: `ממתין`, joined: `21.09.2023` },
  { id: 4, name: `דניאל שגיא`, email: `daniel.sagi@helamclub.co.il`, role: `חבר קהילה`, status: `פעיל`, joined: `14.11.2023` },
  { id: 5, name: `שירה אזולאי`, email: `shira.azoulay@helamclub.co.il`, role: `חבר קהילה`, status: `מושהה`, joined: `02.02.2024` },
  { id: 6, name: `יובל פרץ`, email: `yuval.peretz@helamclub.co.il`, role: `כותב`, status: `פעיל`, joined: `18.04.2024` },
];
