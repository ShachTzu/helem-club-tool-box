import React from 'react';

export type NotFoundIllustrationProps = {
  /**
   * class name for the illustration.
   */
  className?: string;

  /**
   * inline style for the illustration.
   */
  style?: React.CSSProperties;
};

/**
 * a calm, minimal illustration of a compass losing its way, used on the 404 page.
 */
export function NotFoundIllustration({ className, style }: NotFoundIllustrationProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <circle cx="80" cy="80" r="46" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
      <path
        d="M96 64L72 72L64 96L88 88L96 64Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <circle cx="80" cy="80" r="4" fill="currentColor" />
    </svg>
  );
}
