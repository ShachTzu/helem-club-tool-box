import React from 'react';

export type ArrowIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small arrow icon, pointing to the start direction (RTL-aware via CSS transform of parent).
 */
export function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M19 12H5M5 12L11 6M5 12L11 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
