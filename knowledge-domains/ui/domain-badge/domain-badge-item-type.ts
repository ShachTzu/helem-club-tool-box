export type DomainBadgeItem = {
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
