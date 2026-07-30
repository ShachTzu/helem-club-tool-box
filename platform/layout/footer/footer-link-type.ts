export type FooterLink = {
  /**
   * the visible label of the link.
   */
  label: string;

  /**
   * the destination path or url of the link.
   */
  href: string;

  /**
   * the group/column name the link belongs to.
   * links sharing the same group are rendered together under one heading.
   */
  group?: string;

  /**
   * marks the link as pointing to an external destination.
   */
  external?: boolean;
};
