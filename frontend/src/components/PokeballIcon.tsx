import React from 'react';

interface PokeballIconProps {
  size?: number;
  className?: string;
  title?: string;
}

const PokeballIcon: React.FC<PokeballIconProps> = ({ size = 220, className, title = 'Poké Ball' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    role="img"
    aria-label={title}
    className={className}
  >
    <circle cx="256" cy="256" r="248" fill="#ffffff" stroke="#2d2d2d" strokeWidth="16" />
    <path d="M8 256c0-137 111-248 248-248s248 111 248 248" fill="#e3350d" />
    <path d="M504 256c0 137-111 248-248 248S8 393 8 256" fill="#b2b2b2" />
    <path d="M32 256h448" stroke="#2d2d2d" strokeWidth="32" strokeLinecap="round" />
    <circle cx="256" cy="256" r="86" fill="#fff" stroke="#2d2d2d" strokeWidth="16" />
    <circle cx="256" cy="256" r="48" fill="#ffffff" stroke="#2d2d2d" strokeWidth="8" />
    <circle cx="256" cy="256" r="248" fill="none" stroke="#2d2d2d" strokeWidth="16" />
    <defs>
      <radialGradient id="pbShadow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(256 256) scale(248)">
        <stop offset="0%" stopColor="rgba(0,0,0,0.05)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
      </radialGradient>
    </defs>
  </svg>
);

export default PokeballIcon;
