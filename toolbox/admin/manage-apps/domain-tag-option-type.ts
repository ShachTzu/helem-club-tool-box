/**
 * a plain coping-domain option used to seed the domain tagging control
 * with mock/testing data, mirroring the shape expected by the
 * domain-selector package.
 */
export type DomainTagOption = {
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
   * icon (emoji) representing the domain.
   */
  icon?: string;
};
