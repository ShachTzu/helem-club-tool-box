import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { GalleryIconProps } from './gallery-icon-props-type.js';

const ART_PATH = `M12 3c-4.97 0-9 3.8-9 8.5 0 3 2.24 4.5 4.2 4.5.9 0 1.3-.5 1.3-1.2 0-.6-.4-1-.4-1.7 0-.8.7-1.4 1.6-1.4h2.4c2.9 0 5.4-2 5.4-5C17.5 4.6 15 3 12 3Z M8.3 10.3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M11.3 7.8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M15 8.8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M16.3 12.3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z`;

/**
 * gallery icon representing an art / illustration media item.
 * used to label and filter artwork content across the gallery.
 */
export function ArtIcon({
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  title = `אמנות`,
  className,
  style,
}: GalleryIconProps) {
  return (
    <Icon
      path={ART_PATH}
      size={size}
      color={color}
      variant={variant}
      title={title}
      className={className}
      style={style}
    />
  );
}
