import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface FooterLink {
  /**
   * display label for the footer link.
   */
  label: string;

  /**
   * target URL for the footer link.
   */
  href: string;

  /**
   * optional category or group name.
   */
  group?: string;
}

export type FooterLinkSlot = SlotRegistry<FooterLink[]>;