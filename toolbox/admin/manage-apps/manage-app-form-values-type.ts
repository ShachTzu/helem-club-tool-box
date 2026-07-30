/**
 * editable form values used by the create/edit app form in the
 * manage-apps admin panel.
 */
export type ManageAppFormValues = {
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
   * platforms the app is available on, as a comma separated string.
   */
  platform: string;

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
};
