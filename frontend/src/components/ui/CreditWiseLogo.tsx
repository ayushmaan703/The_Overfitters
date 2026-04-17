import React from "react";

export const CreditWiseLogo = ({ className = "h-8 w-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      
      {/* Shield Base */}
      <path
        d="M50 15 L85 22 V50 C85 75 50 90 50 90 C50 90 15 75 15 50 V22 L50 15 Z"
        fill="url(#shieldGrad)"
      />
      
      {/* Chart Bars */}
      <rect x="30" y="55" width="8" height="25" rx="3" fill="white" fillOpacity="0.7" />
      <rect x="42" y="45" width="8" height="35" rx="3" fill="white" fillOpacity="0.85" />
      <rect x="54" y="35" width="8" height="45" rx="3" fill="white" fillOpacity="0.95" />
      <rect x="66" y="25" width="8" height="55" rx="3" fill="white" />
      
      {/* Upward Arrow Path */}
      <path
        d="M22 65 L38 52 L50 58 L72 38"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Arrow Head */}
      <path
        d="M62 38 L72 38 L72 48"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Sparkle (Top Right) */}
      <path
        d="M75 10 C75 18 82 25 90 25 C82 25 75 32 75 40 C75 32 68 25 60 25 C68 25 75 18 75 10 Z"
        fill="white"
      />
      
      {/* Small Sparkle */}
      <path
        d="M92 5 C92 9 95 12 99 12 C95 12 92 15 92 19 C92 15 89 12 85 12 C89 12 92 9 92 5 Z"
        fill="white"
      />
    </svg>
  );
};
