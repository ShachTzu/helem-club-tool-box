/**
 * describes how a single cross-sliced content type (article, tool, video,
 * event, gallery item, etc) should be labeled and iconified when grouped
 * into a section of the domain content feed.
 */
export type ContentTypeMeta = {
  /**
   * the content type key, matching `TaggedContent.type` (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  type: string;

  /**
   * emoji or icon representing the content type.
   */
  icon: string;

  /**
   * hebrew section label for this content type, e.g. 'כלים מארגז הכלים'.
   */
  label: string;
};

/**
 * default content type groupings for the ecosystem's known providers,
 * matching the order they are rendered in the cross-sliced domain feed.
 */
export const DEFAULT_CONTENT_TYPE_META: ContentTypeMeta[] = [
  { type: `app`, icon: `🧰`, label: `כלים מארגז הכלים` },
  { type: `post`, icon: `📝`, label: `כתבות מהבלוג` },
  { type: `record`, icon: `📚`, label: `תכנים מספריית הידע` },
  { type: `event`, icon: `📅`, label: `אירועים קהילתיים` },
  { type: `gallery`, icon: `🎨`, label: `גלריית יצירות` },
];
