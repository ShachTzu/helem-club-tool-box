import React from 'react';

export type ChevronDownIconProps = {
  /**
   * class name for the svg element.
   */
  className?: string;
};

/**
 * a small chevron-down glyph used as the default dropdown affordance.
 */
export function ChevronDownIcon({ className }: ChevronDownIconProps) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
