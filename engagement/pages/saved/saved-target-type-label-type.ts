import type { SavedItemTargetType } from '@helemclub/engagement.entities.saved-item';

/**
 * a map from a saved item's target type to its Hebrew display label,
 * rendered as a small tag on each saved card.
 */
export type SavedTargetTypeLabelMap = Record<SavedItemTargetType, string>;
