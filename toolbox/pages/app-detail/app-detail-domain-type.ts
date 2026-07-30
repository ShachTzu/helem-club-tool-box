/**
 * a coping-domain tag associated with an app, used to render domain badges
 * linking back to the domain's lobby page.
 */
export type AppDetailDomain = {
  /**
   * unique identifier of the domain.
   */
  id: string;

  /**
   * url-friendly slug of the domain, used to build the link to the domain's lobby page.
   */
  slug: string;

  /**
   * display name of the domain (Hebrew).
   */
  name: string;
};
