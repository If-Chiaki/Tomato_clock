import React from 'react';

export const TomatoIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 5c-5.5 0-10 3.5-10 9s4.5 9 10 9 10-3.5 10-9-4.5-9-10-9z" />
    <path d="M12 5V2" />
    <path d="M12 5c2-2 4-2 4-4" />
    <path d="M12 5c-2-2-4-2-4-4" />
    <path d="M8 10a2 2 0 1 0 4 0" />
  </svg>
);
