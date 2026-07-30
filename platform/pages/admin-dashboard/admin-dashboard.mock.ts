import type { AdminDashboardMetric } from './admin-dashboard-metric-type.js';

/**
 * default summary metrics shown on the admin dashboard overview, used when
 * no metrics are supplied by the caller.
 */
export const DEFAULT_ADMIN_DASHBOARD_METRICS: AdminDashboardMetric[] = [
  { id: `visitors`, label: `מבקרים החודש`, value: `1,248` },
  { id: `published-posts`, label: `כתבות שפורסמו`, value: `86` },
  { id: `comments`, label: `תגובות`, value: `312` },
  { id: `verified-members`, label: `חברי קהילה מאומתים`, value: `47` },
];
