import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type ChangesRequestedIconProps = LibraryIconProps;

/**
 * document with a question mark, representing requested changes.
 */
export function ChangesRequestedIcon({
  size = `medium`,
  color = `current`,
  title,
  className,
  style,
}: ChangesRequestedIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 3v4h4"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 13a2 2 0 1 1 2.5 1.94c-.5.15-.5.56-.5 1.06"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="18.5" r="0.6" stroke="currentColor" strokeWidth={2} fill="currentColor" />
    </Icon>
  );
}
