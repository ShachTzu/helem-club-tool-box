import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type DiffIconProps = LibraryIconProps;

/**
 * two columns with highlighted lines, representing a version diff.
 */
export function DiffIcon({ size = `medium`, color = `current`, title, className, style }: DiffIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <rect
        x="3"
        y="4"
        width="7"
        height="16"
        rx="1"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
      <rect
        x="14"
        y="4"
        width="7"
        height="16"
        rx="1"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
      <path
        d="M5 9h3M5 13h3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 9h3M16 13h3M16 17h3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Icon>
  );
}
