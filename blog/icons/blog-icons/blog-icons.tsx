import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { BlogIconProps } from './blog-icon-props-type.js';

const ARTICLE_PATH = `M6 3h8l6 6v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M14 3v5a1 1 0 0 0 1 1h5 M8 13h8 M8 16h8 M8 10h4`;

const EDIT_PATH = `M4 20h4L18.5 9.5a2.121 2.121 0 0 0-3-3L5 17v3Z M14 7l3 3`;

const SUBMIT_PATH = `M22 2 11 13 M22 2l-7 20-4-9-9-4 20-7Z`;

const MEMBERS_ONLY_PATH = `M6 10V7a6 6 0 0 1 12 0v3 M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z M12 14v3`;

const STATS_PATH = `M4 20V10 M10 20V4 M16 20v-7 M4 20h16`;

/**
 * icon representing a blog article/document.
 */
export function ArticleIcon({ size, color, variant, title = `כתבה`, className, style }: BlogIconProps) {
  return (
    <Icon
      path={ARTICLE_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * icon representing editing content, shown as a pencil.
 */
export function EditIcon({ size, color, variant, title = `עריכה`, className, style }: BlogIconProps) {
  return (
    <Icon
      path={EDIT_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * icon representing submitting an article, shown as a paper airplane.
 */
export function SubmitIcon({ size, color, variant, title = `הגשה`, className, style }: BlogIconProps) {
  return (
    <Icon
      path={SUBMIT_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * icon representing content restricted to community members, shown as a lock.
 */
export function MembersOnlyIcon({ size, color, variant, title = `לחברי קהילה בלבד`, className, style }: BlogIconProps) {
  return (
    <Icon
      path={MEMBERS_ONLY_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}

/**
 * icon representing blog statistics, shown as a bar chart.
 */
export function StatsIcon({ size, color, variant, title = `נתוני בלוג`, className, style }: BlogIconProps) {
  return (
    <Icon
      path={STATS_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}
