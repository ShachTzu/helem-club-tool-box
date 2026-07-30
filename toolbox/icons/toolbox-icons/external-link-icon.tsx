import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { ToolboxIconProps } from './toolbox-icon-props-type.js';

const EXTERNAL_LINK_PATH = `M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3`;

/**
 * icon marking a link that opens an external destination
 * (e.g. the app's external store/website link).
 */
export function ExternalLinkIcon({
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
      path={EXTERNAL_LINK_PATH}
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
