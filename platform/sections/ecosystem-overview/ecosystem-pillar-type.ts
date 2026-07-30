/**
 * A single ecosystem pillar card, linking to its dedicated lobby page.
 */
export type EcosystemPillar = {
  /**
   * a unique slug identifying the pillar.
   */
  slug: string;

  /**
   * an emoji or short glyph representing the pillar.
   */
  icon: string;

  /**
   * the pillar title, for example "מאגר ידע".
   */
  title: string;

  /**
   * a short description of the pillar content.
   */
  description: string;

  /**
   * the path to the pillar's lobby page.
   */
  href: string;
};
