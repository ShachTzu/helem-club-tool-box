import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type ToolboxIconProps = HelamIconProps;

/**
 * toolbox icon for the toolbox feature navigation item.
 */
export function ToolboxIcon({ size = `medium`, color = `current`, title, className, style }: ToolboxIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="2" y1="11" x2="22" y2="11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}
