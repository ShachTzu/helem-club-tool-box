import type { ComponentType } from 'react';
import { ReviewQueue } from './review-queue.js';

/**
 * platform user roles, ordered by increasing privilege. declared locally
 * to avoid depending on the platform entities package directly.
 */
export type ReviewQueueAdminRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * shape expected by the platform's admin shell `AdminPanel` slot.
 */
export type ReviewQueueAdminPanelItem = {
  /**
   * unique id of the admin panel.
   */
  id: string;

  /**
   * Hebrew label shown in the admin navigation.
   */
  label: string;

  /**
   * the component rendered when the panel is selected.
   */
  component: ComponentType;

  /**
   * the minimum role required to see this panel.
   */
  minRole?: ReviewQueueAdminRole;

  /**
   * ordering hint within the admin navigation.
   */
  order?: number;
};

/**
 * the review queue, packaged for registration into the platform's admin
 * route slot. moderators and admins both need it, so the minimum role is
 * `moderator`.
 */
export const reviewQueueAdminPanel: ReviewQueueAdminPanelItem = {
  id: 'knowledge-library-review-queue',
  label: 'תור ביקורת',
  component: ReviewQueue,
  minRole: 'moderator',
  order: 30,
};
