import React from 'react';
import { Icon } from '@helemclub/design.content.icon';
import type { HelamIconProps } from './helam-icon-props-type.js';

export type HomeIconProps = HelamIconProps;

const HOME_PATH = `M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10`;

/**
 * home navigation icon.
 */
export function HomeIcon({ size = `medium`, color = `current`, title, className, style }: HomeIconProps) {
  return (
    <Icon
      path={HOME_PATH}
      size={size}
      color={color}
      title={title}
      className={className}
      style={style}
    />
  );
}
