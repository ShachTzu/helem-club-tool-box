import React from 'react';

export type BookmarkIconProps = {
  /**
   * renders the icon in its filled (saved) state.
   */
  filled?: boolean;

  /**
   * class name for the icon.
   */
  className?: string;
};

const BOOKMARK_PATH = `M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z`;

/**
 * a small bookmark icon, filled when the target content is saved.
 */
export function BookmarkIcon({ filled = false, className }: BookmarkIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill={filled ? `currentColor` : `none`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d={BOOKMARK_PATH}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
