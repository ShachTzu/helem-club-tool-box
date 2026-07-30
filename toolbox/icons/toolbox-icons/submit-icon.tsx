import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { ToolboxIconProps } from './toolbox-icon-props-type.js';

const SUBMIT_PATH = `M12 3v12m0-12 5 5m-5-5-5 5M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3`;

/**
 * icon representing submitting a new tool to the toolbox catalog
 * (upload arrow into a tray).
 */
export function SubmitIcon({
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
      path={SUBMIT_PATH}
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
