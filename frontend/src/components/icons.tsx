import React from 'react';

export const ValueIcon: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="Value icon">
    <rect x="6" y="10" width="52" height="44" rx="6" fill="url(#gradValue)" stroke="#f7d358" strokeWidth="2" />
    <path d="M20 26h24M20 34h18M20 42h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <linearGradient id="gradValue" x1="6" y1="10" x2="58" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e3350d" />
        <stop offset="100%" stopColor="#b22207" />
      </linearGradient>
    </defs>
  </svg>
);

export const CompareIcon: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="Compare icon">
    <circle cx="20" cy="32" r="14" fill="#e3350d" stroke="#f7d358" strokeWidth="2" />
    <circle cx="44" cy="32" r="14" fill="#b22207" stroke="#f7d358" strokeWidth="2" />
    <path d="M26 32h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const NewsIcon: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="News icon">
    <rect x="10" y="12" width="44" height="40" rx="4" fill="#121212" stroke="#f7d358" strokeWidth="2" />
    <path d="M18 22h28M18 30h24M18 38h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const SearchIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="Search icon">
    <circle cx="28" cy="28" r="16" stroke="#f7d358" strokeWidth="4" />
    <line x1="40" y1="40" x2="56" y2="56" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
