import React from 'react';

export type TrashIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small trash icon used to indicate destructive actions.
 */
export function TrashIcon({ className }: TrashIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 7H20M9 7V4H15V7M6 7L7 20H17L18 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
