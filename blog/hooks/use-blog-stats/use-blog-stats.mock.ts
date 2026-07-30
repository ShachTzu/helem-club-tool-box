import type { TimeRange } from './use-blog-stats.js';

/**
 * mock time range presets used across tests and previews.
 */
export const mockTimeRangeLast7Days: TimeRange = { preset: '7d' };
export const mockTimeRangeLast30Days: TimeRange = { preset: '30d' };
export const mockTimeRangeLast90Days: TimeRange = { preset: '90d' };
export const mockTimeRangeAllTime: TimeRange = { preset: 'all' };
