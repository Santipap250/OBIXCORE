// components/OBIXLogo.tsx
import Image from "next/image";

interface OBIXLogoProps {
  /** Show only the icon box (for favicon / compact nav spots) */
  iconOnly?: boolean;
  /** Square size for the icon version */
  size?: number;
  /** Explicit height for the full logo lockup (useful in nav/header) */
  height?: number;
  /** Max width for the full lockup */
  maxWidth?: number;
  className?: string;
}

const LOGO_ASPECT_RATIO = 1536 / 511;

export default function OBIXLogo({
  iconOnly = false,
  size = 40,
  height,
  maxWidth = 560,
  className = "",
}: OBIXLogoProps) {
  if (iconOnly) {
    return (
      <div
        className={`relative inline-block shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/obixcore-icon.png"
          alt="OBIXCORE icon"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  const resolvedHeight = height ?? Math.round(maxWidth / LOGO_ASPECT_RATIO);
  const resolvedWidth = Math.round(resolvedHeight * LOGO_ASPECT_RATIO);

  return (
    <div
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: resolvedWidth, height: resolvedHeight, maxWidth: "100%" }}
    >
      <Image
        src="/obixcore-logo.png"
        alt="OBIXCORE FPV Tuning Platform"
        fill
        sizes={`(max-width: 768px) 92vw, ${resolvedWidth}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}
