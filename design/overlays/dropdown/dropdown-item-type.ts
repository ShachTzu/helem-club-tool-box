export type DropdownItemType = {
  /**
   * unique identifier for the item.
   */
  id: string;

  /**
   * label text rendered for the item.
   */
  label: string;

  /**
   * optional emoji/icon rendered before the label.
   */
  icon?: string;

  /**
   * called when the item is selected.
   */
  onSelect?: () => void;

  /**
   * disables the item, preventing selection.
   */
  disabled?: boolean;

  /**
   * marks the item as a destructive action (e.g. sign out, delete).
   */
  danger?: boolean;
};
