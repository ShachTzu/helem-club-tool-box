import React from 'react';

export type CommentIconProps = {
  /**
   * class name for the icon.
   */
  className?: string;
};

/**
 * a small speech-bubble icon representing comments.
 */
export function CommentIcon({ className }: CommentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4.2a.5.5 0 0 1-.84-.37V16h-.16A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
