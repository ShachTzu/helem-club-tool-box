import React from 'react';

export type EmptyBoxIconProps = {
  /**
   * class name to override the icon svg.
   */
  className?: string;

  /**
   * style to apply to the icon svg.
   */
  style?: React.CSSProperties;
};

/**
 * a friendly default illustration for empty states — an open, empty box.
 */
export function EmptyBoxIcon({ className, style }: EmptyBoxIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 6L50 16.5V39.5L28 50L6 39.5V16.5L28 6Z"
        stroke="var(--colors-secondary-default)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="var(--colors-surface-primary)"
      />
      <path
        d="M6 16.5L28 27L50 16.5"
        stroke="var(--colors-secondary-default)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M28 27V50" stroke="var(--colors-secondary-default)" strokeWidth="2.5" />
      <path
        d="M18 21.5L38 11.5"
        stroke="var(--colors-accent-default)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="27" r="5.5" fill="var(--colors-accent-default)" opacity="0.9" />
    </svg>
  );
}
