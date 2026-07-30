/**
 * a single knowledge domain record managed by the admin panel.
 */
export type DomainRecord = {
  /**
   * unique identifier of the domain.
   */
  id: string;

  /**
   * url-friendly, unique slug of the domain.
   */
  slug: string;

  /**
   * display name of the domain, in Hebrew.
   */
  name: string;

  /**
   * short description of the domain.
   */
  description?: string;

  /**
   * icon (emoji) representing the domain.
   */
  icon?: string;

  /**
   * number of content items tagged with this domain.
   */
  count: number;
};
