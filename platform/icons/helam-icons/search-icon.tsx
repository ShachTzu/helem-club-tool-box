import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type SearchIconProps = HelamIconProps;

/**
 * search / magnifying glass icon.
 */
export function SearchIcon({ size = `medium`, color = `current`, title, className, style }: SearchIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} fill="none" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}
