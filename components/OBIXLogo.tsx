// components/OBIXLogo.tsx
import Image from "next/image";

interface OBIXLogoProps {
  /** Show only the icon box (for favicon / compact nav spots) */
  iconOnly?: boolean;
  /** Square size for the icon version */
  size?: number;
  /** Max width for the full lockup */
  maxWidth?: number;
  className?: string;
}

export default function OBIXLogo({
  iconOnly = false,
  size = 40,
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

  return (
    <div
      className={`relative inline-block w-full shrink-0 ${className}`}
      style={{ maxWidth, aspectRatio: "1536 / 511" }}
    >
      <Image
        src="/obixcore-logo.png"
        alt="OBIXCORE FPV Tuning Platform"
        fill
        sizes={`(max-width: 768px) 92vw, ${maxWidth}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}
