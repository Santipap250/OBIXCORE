// components/OBIXLogo.tsx
// Faithful SVG recreation of the OBIXCORE brand mark.
// The OX icon uses a glowing rounded-square frame with faceted white→green O
// and green→cyan X. The wordmark OBIX is white/silver and CORE fades green→cyan.
// "FPV TUNING PLATFORM" sits below as a spaced mono tagline.

interface OBIXLogoProps {
  /** Show only the icon box (for favicon / compact nav spots) */
  iconOnly?: boolean;
  /** Height of the full lockup in px — width scales automatically */
  height?: number;
  className?: string;
}

export default function OBIXLogo({ iconOnly = false, height = 40, className = "" }: OBIXLogoProps) {
  const uniqueId = "obx"; // stable — one set of defs per page is fine

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
          <linearGradient id={`${uniqueId}-border`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="55%" stopColor="#00e87a" />
            <stop offset="100%" stopColor="#00d8cc" />
          </linearGradient>
          <linearGradient id={`${uniqueId}-o`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#c8ffe0" />
            <stop offset="100%" stopColor="#00e87a" />
          </linearGradient>
          <linearGradient id={`${uniqueId}-x`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e87a" />
            <stop offset="100%" stopColor="#00d8cc" />
          </linearGradient>
          <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={`${uniqueId}-ring`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="56" height="56" rx="12" fill="#07090d" />

        {/* Outer glow border */}
        <rect x="1.5" y="1.5" width="53" height="53" rx="11.5"
          fill="none" stroke={`url(#${uniqueId}-border)`}
          strokeWidth="2" filter={`url(#${uniqueId}-ring)`} opacity="0.85" />

        {/* Crisp inner border */}
        <rect x="2.5" y="2.5" width="51" height="51" rx="10.5"
          fill="none" stroke={`url(#${uniqueId}-border)`}
          strokeWidth="1" opacity="0.5" />

        {/* O — faceted hexagonal outline */}
        <g filter={`url(#${uniqueId}-glow)`}>
          <path
            d="M7 19 L10.5 15 L22 15 L25.5 19 L25.5 28 L22 32 L10.5 32 L7 28 Z"
            fill="none"
            stroke={`url(#${uniqueId}-o)`}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* inner cutout */}
          <path
            d="M11 21 L13 19 L19.5 19 L21.5 21 L21.5 26 L19.5 28 L13 28 L11 26 Z"
            fill="#07090d"
          />
        </g>

        {/* X — crossed strokes with white highlight */}
        <g filter={`url(#${uniqueId}-glow)`}>
          <line x1="31" y1="15" x2="49" y2="32" stroke={`url(#${uniqueId}-x)`} strokeWidth="3.8" strokeLinecap="round" />
          <line x1="49" y1="15" x2="31" y2="32" stroke={`url(#${uniqueId}-x)`} strokeWidth="3.8" strokeLinecap="round" />
          {/* Highlight streaks */}
          <line x1="32" y1="16" x2="48" y2="31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
          <line x1="48" y1="16" x2="32" y2="31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        </g>

        {/* Divider */}
        <line x1="7" y1="38" x2="49" y2="38" stroke="#1e2a38" strokeWidth="0.75" />

        {/* FPV tagline */}
        <text x="28" y="49" textAnchor="middle" fill="#00e87a"
          fontSize="7.5" fontFamily="monospace" letterSpacing="3.5" opacity="0.75">
          FPV
        </text>
      </svg>
    );
  }

  // ── Full lockup: icon + wordmark ──────────────────────────
  // ViewBox: icon 56×56, then wordmark starting at x=68
  const vw = 340;
  const vh = 56;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      height={height}
      width={(vw / vh) * height}
      className={className}
      aria-label="OBIXCORE FPV Tuning Platform"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${uniqueId}-border`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="55%" stopColor="#00e87a" />
          <stop offset="100%" stopColor="#00d8cc" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-o`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#c8ffe0" />
          <stop offset="100%" stopColor="#00e87a" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-x`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e87a" />
          <stop offset="100%" stopColor="#00d8cc" />
        </linearGradient>
        {/* OBIX = white/silver */}
        <linearGradient id={`${uniqueId}-obix`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e8f4ff" />
          <stop offset="100%" stopColor="#a8c0d8" />
        </linearGradient>
        {/* CORE = green → cyan */}
        <linearGradient id={`${uniqueId}-core`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e87a" />
          <stop offset="55%" stopColor="#00cc99" />
          <stop offset="100%" stopColor="#00d8ff" />
        </linearGradient>
        <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${uniqueId}-ring`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${uniqueId}-textglow`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── OX Icon Box ── */}
      <rect width="56" height="56" rx="12" fill="#07090d" />
      <rect x="1.5" y="1.5" width="53" height="53" rx="11.5"
        fill="none" stroke={`url(#${uniqueId}-border)`}
        strokeWidth="2" filter={`url(#${uniqueId}-ring)`} opacity="0.9" />
      <rect x="2.5" y="2.5" width="51" height="51" rx="10.5"
        fill="none" stroke={`url(#${uniqueId}-border)`}
        strokeWidth="1" opacity="0.45" />

      {/* O */}
      <g filter={`url(#${uniqueId}-glow)`}>
        <path
          d="M7 19 L10.5 15 L22 15 L25.5 19 L25.5 28 L22 32 L10.5 32 L7 28 Z"
          fill="none" stroke={`url(#${uniqueId}-o)`}
          strokeWidth="3.2" strokeLinejoin="round"
        />
        <path
          d="M11 21 L13 19 L19.5 19 L21.5 21 L21.5 26 L19.5 28 L13 28 L11 26 Z"
          fill="#07090d"
        />
      </g>

      {/* X */}
      <g filter={`url(#${uniqueId}-glow)`}>
        <line x1="31" y1="15" x2="49" y2="32" stroke={`url(#${uniqueId}-x)`} strokeWidth="3.8" strokeLinecap="round" />
        <line x1="49" y1="15" x2="31" y2="32" stroke={`url(#${uniqueId}-x)`} strokeWidth="3.8" strokeLinecap="round" />
        <line x1="32" y1="16" x2="48" y2="31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        <line x1="48" y1="16" x2="32" y2="31" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      </g>

      <line x1="7" y1="38" x2="49" y2="38" stroke="#1e2a38" strokeWidth="0.75" />
      <text x="28" y="49" textAnchor="middle" fill="#00e87a"
        fontSize="7.5" fontFamily="monospace" letterSpacing="3.5" opacity="0.75">
        FPV
      </text>

      {/* ── Wordmark ── */}
      <g transform="translate(68 0)">
        {/* OBIX — white/silver */}
        <text
          y="38"
          fontFamily="'Orbitron', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="30"
          letterSpacing="1"
          fill={`url(#${uniqueId}-obix)`}
          filter={`url(#${uniqueId}-textglow)`}
        >
          OBIX
        </text>

        {/* CORE — green→cyan, offset after OBIX (≈ 4×30px ≈ 88px char width + kerning) */}
        <text
          x="92"
          y="38"
          fontFamily="'Orbitron', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="30"
          letterSpacing="1"
          fill={`url(#${uniqueId}-core)`}
          filter={`url(#${uniqueId}-textglow)`}
        >
          CORE
        </text>

        {/* FPV TUNING PLATFORM tagline */}
        <g>
          {/* Left dash */}
          <line x1="0" y1="47" x2="14" y2="47" stroke="#00e87a" strokeWidth="1.5" strokeLinecap="round" />
          {/* Tagline text */}
          <text x="18" y="50"
            fontFamily="monospace" fontSize="8.5" letterSpacing="3.5"
            fill="#6b7a90" fontWeight="400"
          >
            FPV TUNING PLATFORM
          </text>
          {/* Right dash — approx end of "FPV TUNING PLATFORM" at ~8.5px * 19chars + spacing */}
          <line x1="254" y1="47" x2="272" y2="47" stroke="#00e87a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
