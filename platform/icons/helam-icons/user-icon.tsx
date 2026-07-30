import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type UserIconProps = HelamIconProps;

const USER_PATH = `M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0`;

/**
 * user / profile icon.
 */
export function UserIcon({ size = `medium`, color = `current`, title, className, style }: UserIconProps) {
  return (
    <Icon
      path={USER_PATH}
      size={size}
      color={color}
      title={title}
      className={className}
      style={style}
    />
  );
}
