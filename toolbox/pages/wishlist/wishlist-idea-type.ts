import type { BadgeVariant } from '@helemclub/design.content.badge';

/**
 * lifecycle status of a community tool idea on the wishlist.
 */
export type WishlistIdeaStatus = 'נאסף' | 'בבדיקה' | 'בפיתוח';

/**
 * a single community-submitted idea for a new coping tool, open for voting.
 */
export type WishlistIdea = {
  /**
   * unique id of the idea.
   */
  id: string;

  /**
   * short title of the proposed tool.
   */
  title: string;

  /**
   * plain-language description of the idea and the need it addresses.
   */
  description: string;

  /**
   * coping domains this idea relates to.
   */
  domains: string[];

  /**
   * number of community up-votes the idea has received.
   */
  votes: number;

  /**
   * current lifecycle status of the idea.
   */
  status: WishlistIdeaStatus;

  /**
   * display name of the member who proposed the idea.
   */
  author: string;
};

/**
 * maps an idea status to the badge tone used to render it.
 */
export const STATUS_TONE: Record<WishlistIdeaStatus, BadgeVariant> = {
  'נאסף': 'neutral',
  'בבדיקה': 'accent',
  'בפיתוח': 'success',
};
