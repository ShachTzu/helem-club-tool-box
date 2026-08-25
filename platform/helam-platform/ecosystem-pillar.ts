import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface EcosystemPillar {
  /**
   * unique slug identifying the pillar.
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
   * path to the pillar's lobby page.
   */
  href: string;

  /**
   * relative order among the other pillars, lower values render first.
   */
  order?: number;
}

export type EcosystemPillarSlot = SlotRegistry<EcosystemPillar[]>;
