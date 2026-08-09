/**
 * a single week's new-review count, keyed by the ISO date the week starts on.
 */
export type ToolboxRatingWeeklyTrendPoint = {
  weekStart: string;
  count: number;
};

/**
 * aggregate stats shown on the toolbox admin engagement dashboard.
 */
export type ToolboxDashboardStats = {
  totalViews: number;
  registeredViews: number;
  reviewCount: number;
  averageStars: number;
  weeklyTrend: ToolboxRatingWeeklyTrendPoint[];
};
