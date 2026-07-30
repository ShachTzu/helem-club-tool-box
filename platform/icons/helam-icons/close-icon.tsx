import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type CloseIconProps = HelamIconProps;

/**
 * close / dismiss icon.
 */
export function CloseIcon({ size = `medium`, color = `current`, title, className, style }: CloseIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}
