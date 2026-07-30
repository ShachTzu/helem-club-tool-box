import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type MenuIconProps = HelamIconProps;

/**
 * hamburger menu icon.
 */
export function MenuIcon({ size = `medium`, color = `current`, title, className, style }: MenuIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}
