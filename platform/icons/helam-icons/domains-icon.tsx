import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type DomainsIconProps = HelamIconProps;

/**
 * globe / domains icon for the cross-cutting domains feature navigation item.
 */
export function DomainsIcon({ size = `medium`, color = `current`, title, className, style }: DomainsIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} fill="none" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path
        d="M12 3a13 13 0 0 1 0 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 3a13 13 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Icon>
  );
}
