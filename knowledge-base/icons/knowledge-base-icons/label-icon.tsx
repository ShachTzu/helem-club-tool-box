import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { KnowledgeBaseIconProps } from './icon-props-type.js';

const LABEL_PATH = `M12.59 2.59a2 2 0 0 0-1.42-.59H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82Z M7.5 7a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z`;

/**
 * label icon (tag), used to represent knowledge-base projects/labels
 * across cards, filters and navigation.
 */
export function LabelIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  strokeWidth = 2,
  title = `תווית`,
  className,
  style,
}: KnowledgeBaseIconProps) {
  return (
    <Icon
      path={LABEL_PATH}
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
