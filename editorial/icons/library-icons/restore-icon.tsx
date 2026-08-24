import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type RestoreIconProps = LibraryIconProps;

/**
 * circular arrow rewinding, representing restoring a previous revision.
 */
export function RestoreIcon({ size = `medium`, color = `current`, title, className, style }: RestoreIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M21 12a9 9 0 1 1-3-6.7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21 4v5h-5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
