import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type ReviewIconProps = LibraryIconProps;

/**
 * magnifying glass over a document, representing a review in progress.
 */
export function ReviewIcon({ size = `medium`, color = `current`, title, className, style }: ReviewIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M6 3h7l3 3v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M13 3v3h3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="15"
        cy="16"
        r="3"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
      <path
        d="M17.5 18.5 20 21"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Icon>
  );
}
