import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { KnowledgeBaseIconProps } from './icon-props-type.js';

const PLAY_PATH = `M8 5v14l11-7Z`;

/**
 * play icon, used as the overlay affordance on media thumbnails and
 * inside player controls across the knowledge-base.
 */
export function PlayIcon({
  size = `medium`,
  color = `current`,
  variant = `fill`,
  strokeWidth = 2,
  title = `נגן`,
  className,
  style,
}: KnowledgeBaseIconProps) {
  return (
    <Icon
      path={PLAY_PATH}
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
