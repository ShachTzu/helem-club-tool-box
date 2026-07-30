import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type BlogIconProps = HelamIconProps;

/**
 * blog / article icon for the blog feature navigation item.
 */
export function BlogIcon({ size = `medium`, color = `current`, title, className, style }: BlogIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
