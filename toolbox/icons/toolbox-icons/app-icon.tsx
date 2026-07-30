import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { ToolboxIconProps } from './toolbox-icon-props-type.js';

const APP_GRID_PATH = `M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z`;

/**
 * icon representing a single toolbox app / apps grid.
 * used across app cards, listings and the app detail page.
 */
export function AppIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  strokeWidth = 2,
  title,
  className,
  style,
}: ToolboxIconProps) {
  return (
    <Icon
      path={APP_GRID_PATH}
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
