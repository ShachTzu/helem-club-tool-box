/**
 * Types of content a SavedItem can point to.
 */
export type SavedItemTargetType = 'app' | 'article' | 'event' | 'gallery' | 'domain' | 'other';

export type PlainSavedItem = {
  /**
   * unique id of the saved item.
   */
  id: string;

  /**
   * type of the target content that was saved (e.g. 'app', 'article').
   */
  targetType: SavedItemTargetType;

  /**
   * id of the target content that was saved.
   */
  targetId: string;

  /**
   * anonymous device identifier that saved the item (no account required).
   */
  deviceId: string;

  /**
   * ISO date string of when the item was saved.
   */
  savedAt: string;

  /**
   * display title for rendering the saved list.
   */
  title: string;

  /**
   * url to navigate to when the saved item is opened.
   */
  url: string;

  /**
   * optional display image for rendering the saved list.
   */
  imageUrl?: string;
};

/**
 * SavedItem entity — represents a piece of content a device/user saved
 * for later, alongside the display fields needed to render the saved list.
 */
export class SavedItem {
  constructor(
    /**
     * unique id of the saved item.
     */
    readonly id: string,

    /**
     * type of the target content that was saved (e.g. 'app', 'article').
     */
    readonly targetType: SavedItemTargetType,

    /**
     * id of the target content that was saved.
     */
    readonly targetId: string,

    /**
     * anonymous device identifier that saved the item (no account required).
     */
    readonly deviceId: string,

    /**
     * ISO date string of when the item was saved.
     */
    readonly savedAt: string,

    /**
     * display title for rendering the saved list.
     */
    readonly title: string,

    /**
     * url to navigate to when the saved item is opened.
     */
    readonly url: string,

    /**
     * optional display image for rendering the saved list.
     */
    readonly imageUrl?: string
  ) {}

  /**
   * serialize a SavedItem into a plain, transferable object.
   */
  toObject(): PlainSavedItem {
    return {
      id: this.id,
      targetType: this.targetType,
      targetId: this.targetId,
      deviceId: this.deviceId,
      savedAt: this.savedAt,
      title: this.title,
      url: this.url,
      imageUrl: this.imageUrl,
    };
  }

  /**
   * create a SavedItem instance from a plain object.
   */
  static from(plainSavedItem: Partial<PlainSavedItem>): SavedItem {
    const {
      id = '',
      targetType = 'other',
      targetId = '',
      deviceId = '',
      savedAt = new Date().toISOString(),
      title = '',
      url = '',
      imageUrl = undefined,
    } = plainSavedItem;

    return new SavedItem(id, targetType, targetId, deviceId, savedAt, title, url, imageUrl);
  }
}
