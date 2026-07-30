import React from 'react';

export type CopyLinkIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a link/chain icon used for the copy-link share action.
 */
export function CopyLinkIcon({ className }: CopyLinkIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9.5 14.5 14.5 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 7.5 12.379 6.12a3.5 3.5 0 0 1 4.95 4.95L15.9 12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 16.5 11.62 17.88a3.5 3.5 0 0 1-4.95-4.95L8.1 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
