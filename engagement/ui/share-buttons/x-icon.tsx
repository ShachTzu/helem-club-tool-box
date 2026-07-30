import React from 'react';

export type XIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * X (formerly Twitter) brand icon used in the share buttons row.
 */
export function XIcon({ className }: XIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17.53 2.5h3.15l-6.88 7.86L21.9 21.5h-6.33l-4.96-6.49-5.68 6.49H1.8l7.36-8.41L1.1 2.5h6.49l4.48 5.93 5.46-5.93Zm-1.1 17.06h1.75L7.66 4.34H5.78l10.65 15.22Z"
        fill="currentColor"
      />
    </svg>
  );
}
