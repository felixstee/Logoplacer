import React from 'react';

export default function Logo({ size = 32 }) {
  const uid = "lp" + size;
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${uid}g1`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="40%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id={`${uid}g2`} x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      {/* Envelope body */}
      <rect x="8" y="22" width="84" height="58" rx="10" stroke={`url(#${uid}g1)`} strokeWidth="7" fill="none" strokeLinejoin="round"/>
      {/* Envelope flap V */}
      <path d="M10 26 L50 58 L90 26" stroke={`url(#${uid}g1)`} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* AI sparkle bottom-right */}
      <g opacity="0.9">
        <path d="M82 76 L84 82 L90 84 L84 86 L82 92 L80 86 L74 84 L80 82 Z" fill={`url(#${uid}g2)`}/>
      </g>
    </svg>
  );
}
