import { DIFFICULTY_COLORS, STYLE_COLORS } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "difficulty" | "style" | "default" | "outline";
  value?: string;
  className?: string;
}

export default function Badge({ children, variant = "default", value, className = "" }: BadgeProps) {
  let colorClasses = "border-cyan-DEFAULT/18 text-text-muted bg-bg-elevated/80";

  if (variant === "difficulty" && value) {
    colorClasses = DIFFICULTY_COLORS[value] || colorClasses;
  } else if (variant === "style" && value) {
    colorClasses = STYLE_COLORS[value] || colorClasses;
  } else if (variant === "outline") {
    colorClasses = "border-white/10 text-text-muted bg-bg-surface/70";
  }

  return (
    <span
      className={`
        hud-chip inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.22em]
        shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]
        ${colorClasses} ${className}
      `}
    >
      {children}
    </span>
  );
}
