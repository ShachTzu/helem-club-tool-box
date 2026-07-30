import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { GalleryIconProps } from './gallery-icon-props-type.js';

const IMAGE_PATH = `M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z M8 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M3.5 16.5 8.5 12l3 3 4-5 4.5 6.5`;

/**
 * gallery icon representing an image / photo media item.
 * used to label and filter photo content across the gallery.
 */
export function ImageIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `תמונה`,
  className,
  style,
}: GalleryIconProps) {
  return (
    <Icon
      path={IMAGE_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}
