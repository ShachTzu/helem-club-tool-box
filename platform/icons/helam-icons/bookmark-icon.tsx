import React from 'react';
import { Icon, type IconVariant } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type BookmarkIconProps = HelamIconProps & {
  /**
   * whether the bookmark is drawn as an outline or a solid shape.
   */
  variant?: IconVariant;
};

const BOOKMARK_PATH = `M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z`;

/**
 * bookmark / saved icon.
 */
export function BookmarkIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title,
  className,
  style,
}: BookmarkIconProps) {
  return (
    <Icon
      path={BOOKMARK_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}
