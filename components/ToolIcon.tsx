import Image from "next/image";

export type ToolIconKey =
  | "home"
  | "wizard"
  | "analysis"
  | "warning"
  | "calculator"
  | "preset"
  | "3d-view"
  | "blackbox"
  | "profiles";

const ICON_SRC: Record<ToolIconKey, string> = {
  home: "/tool-icons/home.png",
  wizard: "/tool-icons/wizard.png",
  analysis: "/tool-icons/analysis.png",
  warning: "/tool-icons/warning.png",
  calculator: "/tool-icons/calculator.png",
  preset: "/tool-icons/preset.png",
  "3d-view": "/tool-icons/3d-view.png",
  blackbox: "/tool-icons/blackbox.png",
  profiles: "/tool-icons/profiles.png",
};

interface ToolIconProps {
  icon: ToolIconKey;
  alt?: string;
  size?: number;
  className?: string;
  active?: boolean;
  priority?: boolean;
}

export default function ToolIcon({
  icon,
  alt = "",
  size = 72,
  className = "",
  active = false,
  priority = false,
}: ToolIconProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={ICON_SRC[icon]}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className={`h-full w-full object-contain transition-transform duration-300 ${
          active ? "scale-[1.03] drop-shadow-[0_0_10px_rgba(70,240,184,0.18)]" : "opacity-95"
        }`}
      />
    </span>
  );
}
