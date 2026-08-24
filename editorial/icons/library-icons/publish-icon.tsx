import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { LibraryIconProps } from './library-icons-props-type.js';

export type PublishIconProps = LibraryIconProps;

/**
 * arrow rising out of a tray, representing publishing a draft.
 */
export function PublishIcon({ size = `medium`, color = `current`, title, className, style }: PublishIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M12 15V4"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 8l4-4 4 4"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
