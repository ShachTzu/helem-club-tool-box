import React, { type SVGProps } from 'react';

export type CloseIconProps = SVGProps<SVGSVGElement>;

export function CloseIcon({ ...rest }: CloseIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M14 4L4 14M4 4L14 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
