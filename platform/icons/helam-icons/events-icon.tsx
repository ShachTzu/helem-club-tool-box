import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type EventsIconProps = HelamIconProps;

const EVENTS_PATH = `M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z`;

/**
 * calendar / events icon for the events feature navigation item.
 */
export function EventsIcon({ size = `medium`, color = `current`, title, className, style }: EventsIconProps) {
  return (
    <Icon
      path={EVENTS_PATH}
      size={size}
      color={color}
      title={title}
      className={className}
      style={style}
    />
  );
}
