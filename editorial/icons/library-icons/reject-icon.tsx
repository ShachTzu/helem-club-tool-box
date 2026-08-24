import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type RejectIconProps = LibraryIconProps;

/**
 * X mark inside a circle, representing a rejected draft.
 */
export function RejectIcon({ size = `medium`, color = `current`, title, className, style }: RejectIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
