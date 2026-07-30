import React, { type SVGProps } from 'react';

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.25-.25.6-.33.9-.2 1 .35 2.1.55 3.2.55.55 0 1 .45 1 1V19.5c0 .55-.45 1-1 1C10.4 20.5 3.5 13.6 3.5 5.7c0-.55.45-1 1-1H7.7c.55 0 1 .45 1 1 0 1.1.2 2.2.55 3.2.13.3.05.65-.2.9L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
