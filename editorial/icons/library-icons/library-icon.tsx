import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps as SharedLibraryIconProps } from './library-icons-props-type.js';

export type LibraryIconProps = SharedLibraryIconProps;

/**
 * a shelf of books, representing the knowledge library.
 */
export function LibraryIcon({ size = `medium`, color = `current`, title, className, style }: LibraryIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <rect
        x="4"
        y="5"
        width="3"
        height="15"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect
        x="9"
        y="3"
        width="3"
        height="17"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect
        x="14"
        y="7"
        width="3"
        height="13"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M3 20h18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Icon>
  );
}
