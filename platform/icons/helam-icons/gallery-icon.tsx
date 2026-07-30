import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type GalleryIconProps = HelamIconProps;

/**
 * image gallery icon for the gallery feature navigation item.
 */
export function GalleryIcon({ size = `medium`, color = `current`, title, className, style }: GalleryIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth={2} fill="none" />
      <path
        d="M21 15l-5-5-9 9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
