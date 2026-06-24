// components/OBIXLogo.tsx
// Brand lockup component for OBIXCORE.
// Full version uses the designed logo image shipped in /public so the website
// stays visually identical to the approved asset. Icon-only mode keeps a
// lightweight inline SVG for compact spaces and favicons.

import Image from "next/image";

interface OBIXLogoProps {
  /** Show only the icon box (for favicon / compact nav spots) */
  iconOnly?: boolean;
  /** Height of the full lockup in px — width scales automatically */
  height?: number;
  className?: string;
}

export default function OBIXLogo({ iconOnly = false, height = 40, className = "" }: OBIXLogoProps) {
  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 56 56"
        height={height}
        width={height}
        className={className}
        aria-label="OBIXCORE icon"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="obx-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="55%" stopColor="#00e87a" />
            <stop offset="100%" stopColor="#00d8cc" />
          </linearGradient>
          <linearGradient id="obx-o" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#c8ffe0" />
            <stop offset="100%" stopColor="#00e87a" />
          </linearGradient>
          <linearGradient id="obx-x" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e87a" />
            <stop offset="100%" stopColor="#00d8cc" />
          </linearGradient>
          <filter id="obx-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="obx-ring" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="56" height="56" rx="12" fill="#07090d" />

        <rect x="1.5" y="1.5" width="53" height="53" rx="11.5"
          fill="none" stroke="url(#obx-border)"
          strokeWidth="2" filter="url(#obx-ring)" opacity="0.85" />

        <rect x="2.5" y="2.5" width="51" height="51" rx="10.5"
          fill="none" stroke="url(#obx-border)"
          strokeWidth="1" opacity="0.5" />

        <g filter="url(#obx-glow)">
          <path
            d="M7 19 L10.5 15 L22 15 L25.5 19 L25.5 28 L22 32 L10.5 32 L7 28 Z"
            fill="none"
            stroke="url(#obx-o)"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M11 21 L13 19 L19.5 19 L21.5 21 L21.5 26 L19.5 28 L13 28 L11 26 Z"
            fill="#07090d"
          />
        </g>

        <g filter="url(#obx-glow)">
          <line x1="31" y1="15" x2="49" y2="32" stroke="url(#obx-x)" strokeWidth="3.8" strokeLinecap="round" />
          <line x1="49" y1="15" x2="31" y2="32" stroke="url(#obx-x)" strokeWidth="3.8" strokeLinecap="round" />
          <line x1="32" y1="16" x2="48" y2="31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
          <line x1="48" y1="16" x2="32" y2="31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        </g>

        <line x1="7" y1="38" x2="49" y2="38" stroke="#1e2a38" strokeWidth="0.75" />
        <text x="28" y="49" textAnchor="middle" fill="#00e87a"
          fontSize="7.5" fontFamily="monospace" letterSpacing="3.5" opacity="0.75">
          FPV
        </text>
      </svg>
    );
  }

  return (
    <Image
      src="/obixcore-logo.png"
      alt="OBIXCORE FPV Tuning Platform"
      width={1536}
      height={363}
      priority
      className={className}
      style={{ height, width: "auto" }}
      sizes="(max-width: 768px) 90vw, 540px"
    />
  );
}
