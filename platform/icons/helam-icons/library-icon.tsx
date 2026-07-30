import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type LibraryIconProps = HelamIconProps;

/**
 * library / knowledge base icon for the knowledge feature navigation item.
 */
export function LibraryIcon({ size = `medium`, color = `current`, title, className, style }: LibraryIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M4 19.5V4a1 1 0 0 1 1-1h4v18H5a1 1 0 0 1-1-1Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-5V3Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 6.5l-3 14"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
