import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { KnowledgeBaseIconProps } from './icon-props-type.js';

const VIDEO_PATH = `M5 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z M17 9l4-2.5v11L17 15Z`;

/**
 * video icon, used to mark video content across the knowledge-base
 * (record thumbnails, media type badges and filters).
 */
export function VideoIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  strokeWidth = 2,
  title = `וידאו`,
  className,
  style,
}: KnowledgeBaseIconProps) {
  return (
    <Icon
      path={VIDEO_PATH}
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
