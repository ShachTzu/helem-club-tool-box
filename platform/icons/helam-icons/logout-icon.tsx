import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type LogoutIconProps = HelamIconProps;

/**
 * logout / sign-out icon.
 */
export function LogoutIcon({ size = `medium`, color = `current`, title, className, style }: LogoutIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}
