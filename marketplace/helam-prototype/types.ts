/**
 * Shared types for the Helam Club marketplace prototype.
 */

/** A coping-app catalog entry shown in the marketplace. */
export type App = {
  id: string;
  name: string;
  subtitle: string;
  fullDescription: string;
  externalLink: string;
  icon: string;
  screenshots: string[];
  costType: string;
  platform: string[];
  language: string;
  requiresSignup: boolean;
  clickCount: number;
  helpfulYes: number;
  helpfulNo: number;
  isFeatured: boolean;
  developerName: string;
  originatorName?: string;
  tags: string[];
  avgRating: number;
  ratingCount: number;
  ratingHistogram: number[]; // index 0 = 1 star ... index 4 = 5 stars
};

/** A user review/rating for an app. */
export type Review = {
  id: string;
  appId: string;
  stars: number;
  comment?: string;
  displayName?: string;
  helpfulCount: number;
};

/** A coping-domain tag used for filtering. */
export type Tag = {
  name: string;
  count: number;
};
