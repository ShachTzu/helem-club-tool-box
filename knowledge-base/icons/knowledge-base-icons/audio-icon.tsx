import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { KnowledgeBaseIconProps } from './icon-props-type.js';

const AUDIO_PATH = `M4 13v-1a8 8 0 0 1 16 0v1 M4 13h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z M20 13h-1a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Z`;

/**
 * audio icon (headphones), used to mark audio content across the
 * knowledge-base (record thumbnails, media type badges and filters).
 */
export function AudioIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  strokeWidth = 2,
  title = `אודיו`,
  className,
  style,
}: KnowledgeBaseIconProps) {
  return (
    <Icon
      path={AUDIO_PATH}
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
