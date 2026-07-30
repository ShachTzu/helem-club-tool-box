/**
 * a plain, locally-managed representation of a toolbox app row shown in
 * the manage-apps admin panel.
 */
export type ManageAppRecord = {
  /**
   * unique identifier of the app.
   */
  id: string;

  /**
   * display name of the app.
   */
  name: string;

  /**
   * short one-line subtitle describing the app.
   */
  subtitle: string;

  /**
   * full description of the app.
   */
  fullDescription: string;

  /**
   * external link to the app (store page, website, etc).
   */
  externalLink: string;

  /**
   * icon representing the app (emoji or image url).
   */
  icon: string;

  /**
   * cost model of the app, e.g. "free", "freemium", "paid".
   */
  costType: string;

  /**
   * platforms the app is available on, e.g. ["iOS", "Android", "Web"].
   */
  platform: string[];

  /**
   * primary language of the app.
   */
  language: string;

  /**
   * coping domains the app is tagged with.
   */
  domains: string[];

  /**
   * whether the app is featured in the toolbox.
   */
  isFeatured: boolean;

  /**
   * average rating of the app.
   */
  avgRating: number;

  /**
   * total number of ratings.
   */
  ratingCount: number;

  /**
   * number of times the app link was clicked.
   */
  clickCount: number;
};
