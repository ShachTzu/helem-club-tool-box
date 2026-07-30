import React from 'react';

export type FacebookIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a facebook glyph icon used for outbound social links.
 */
export function FacebookIcon({ className }: FacebookIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15 8.5H17V5.5H15C13.067 5.5 11.5 7.067 11.5 9V11H9.5V14H11.5V19H14.5V14H16.5L17 11H14.5V9C14.5 8.72386 14.7239 8.5 15 8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
