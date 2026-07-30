export type TabItem = {
  /**
   * unique identifier for the tab, used for active state and change events.
   */
  key: string;

  /**
   * label text rendered inside the tab button.
   */
  label: string;
};
