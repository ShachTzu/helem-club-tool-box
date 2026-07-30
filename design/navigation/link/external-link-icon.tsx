import React from 'react';

export type ExternalLinkIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small arrow icon indicating a link opens an external destination.
 */
export function ExternalLinkIcon({ className }: ExternalLinkIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
