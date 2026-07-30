import React from 'react';

export type PlayIconProps = {
  /**
   * class name applied to the svg element.
   */
  className?: string;
};

export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}
