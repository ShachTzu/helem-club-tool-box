import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { ToolboxIconProps } from './toolbox-icon-props-type.js';

const FEATURED_STAR_PATH = `M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.7 7.1-.6L12 2Z`;

/**
 * icon marking an app as community-featured/recommended
 * (matches the star rating visual language used across the toolbox).
 */
export function FeaturedIcon({
  size = `medium`,
  color = `accent`,
  variant = `fill`,
  strokeWidth = 2,
  title,
  className,
  style,
}: ToolboxIconProps) {
  return (
    <Icon
      path={FEATURED_STAR_PATH}
      size={size}
      color={color}
      variant={variant}
      strokeWidth={strokeWidth}
      title={title}
      className={className}
      style={style}
    />
  );
}
