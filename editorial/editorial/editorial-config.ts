/**
 * configuration for the editorial aspect.
 */
export type EditorialConfig = {
  /**
   * the MongoDB connection string used to persist drafts, revisions and the
   * approval trail.
   */
  mongoUrl?: string;
};
