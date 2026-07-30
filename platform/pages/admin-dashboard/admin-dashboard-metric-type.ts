/**
 * a single summary metric shown at the top of the admin dashboard.
 */
export type AdminDashboardMetric = {
  /**
   * unique identifier of the metric.
   */
  id: string;

  /**
   * label describing the metric.
   */
  label: string;

  /**
   * formatted value shown for the metric.
   */
  value: string;
};
