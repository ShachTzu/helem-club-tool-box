import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { GalleryIconProps } from './gallery-icon-props-type.js';

const VIDEO_PATH = `M3 6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z M15 9.8l5.2-3.1a.6.6 0 0 1 .9.5v9.6a.6.6 0 0 1-.9.5L15 14.2`;

/**
 * gallery icon representing a video media item.
 * used to label and filter video content across the gallery.
 */
export function VideoIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `וידאו`,
  className,
  style,
}: GalleryIconProps) {
  return (
    <Icon
      path={VIDEO_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}
