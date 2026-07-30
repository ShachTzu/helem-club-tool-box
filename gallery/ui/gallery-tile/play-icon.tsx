import React from 'react';

export type PlayIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small triangular play icon used to indicate video media.
 */
export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M8 5.5V18.5L19 12L8 5.5Z" fill="currentColor" />
    </svg>
  );
}
