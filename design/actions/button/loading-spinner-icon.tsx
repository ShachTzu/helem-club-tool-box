import React from 'react';

export type LoadingSpinnerIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small rotating spinner icon used to indicate the button loading state.
 */
export function LoadingSpinnerIcon({ className }: LoadingSpinnerIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
