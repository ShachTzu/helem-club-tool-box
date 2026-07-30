import React from 'react';

export type LockIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small padlock icon used to indicate members-only content.
 */
export function LockIcon({ className }: LockIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="5"
        y="10.5"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10.5V7.5C8 5 9.8 3 12 3C14.2 3 16 5 16 7.5V10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
