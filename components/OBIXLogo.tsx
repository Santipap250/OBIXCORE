// components/OBIXLogo.tsx
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
      <Image
        src="/obixcore-icon.png"
        alt="OBIXCORE icon"
        width={512}
        height={512}
        className={className}
        style={{ width: height, height }}
        priority
      />
    );
  }

  return (
    <Image
      src="/obixcore-logo.png"
      alt="OBIXCORE FPV Tuning Platform"
      width={1536}
      height={511}
      className={className}
      style={{ height, width: Math.round((1536 / 511) * height) }}
      priority
    />
  );
}
