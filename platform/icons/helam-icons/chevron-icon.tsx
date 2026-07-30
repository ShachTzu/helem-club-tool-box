import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type ChevronDirection = `up` | `down` | `left` | `right`;

export type ChevronIconProps = HelamIconProps & {
  /**
   * direction the chevron points to.
   */
  direction?: ChevronDirection;
};

const ROTATION_MAP: Record<ChevronDirection, number> = {
  down: 0,
  up: 180,
  right: -90,
  left: 90,
};

/**
 * chevron / directional arrow icon, commonly used for accordions and dropdowns.
 */
export function ChevronIcon({
  size = `medium`,
  color = `current`,
  direction = `down`,
  title,
  className,
  style,
}: ChevronIconProps) {
  return (
    <Icon size={size} color={color} title={title} className={className} style={style}>
      <polyline
        points="6 9 12 15 18 9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        transform={`rotate(${ROTATION_MAP[direction]} 12 12)`}
      />
    </Icon>
  );
}
