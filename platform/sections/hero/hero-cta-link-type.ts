export type HeroCtaLink = {
  /**
   * the visible label of the call-to-action.
   */
  label: string;

  /**
   * the destination path or url of the call-to-action.
   */
  href: string;

  /**
   * marks the destination as external, opening in a new tab.
   */
  external?: boolean;
};
