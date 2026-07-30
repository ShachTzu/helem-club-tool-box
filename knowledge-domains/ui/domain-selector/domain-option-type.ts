/**
 * a plain, serializable representation of a knowledge domain, used to seed
 * the domain-selector with mock/testing data forwarded to the useDomains hook.
 */
export type DomainOption = {
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
   * number of content items tagged with this domain.
   */
  count: number;

  /**
   * short description of the domain.
   */
  description?: string;

  /**
   * icon (emoji or icon key) representing the domain.
   */
  icon?: string;
};
