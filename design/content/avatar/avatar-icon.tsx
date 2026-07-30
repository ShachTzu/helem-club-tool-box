import React from 'react';

export type AvatarIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a generic silhouette icon used as a placeholder
 * for anonymous users without a name or image.
 */
export function AvatarIcon({ className }: AvatarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="60%"
      height="60%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12.5c2.7 0 4.9-2.2 4.9-4.9S14.7 2.7 12 2.7 7.1 4.9 7.1 7.6s2.2 4.9 4.9 4.9Z"
        fill="currentColor"
      />
      <path
        d="M12 14.8c-4.3 0-8.1 2.3-9.6 5.7-.3.7.2 1.4 1 1.4h17.2c.8 0 1.3-.7 1-1.4-1.5-3.4-5.3-5.7-9.6-5.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
