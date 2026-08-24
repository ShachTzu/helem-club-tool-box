import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type ApproveIconProps = LibraryIconProps;

/**
 * checkmark inside a circle, representing an approved draft.
 */
export function ApproveIcon({ size = `medium`, color = `current`, title, className, style }: ApproveIconProps) {
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
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
