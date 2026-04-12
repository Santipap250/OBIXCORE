import { DIFFICULTY_COLORS, STYLE_COLORS } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "difficulty" | "style" | "default" | "outline";
  value?: string;
  className?: string;
}

export default function Badge({ children, variant = "default", value, className = "" }: BadgeProps) {
  let colorClasses = "text-text-muted border-bg-border bg-bg-elevated";

  if (variant === "difficulty" && value) {
    colorClasses = DIFFICULTY_COLORS[value] || colorClasses;
  } else if (variant === "style" && value) {
    colorClasses = STYLE_COLORS[value] || colorClasses;
  } else if (variant === "outline") {
    colorClasses = "text-text-muted border-bg-border";
  }

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium
        border uppercase tracking-wider
        ${colorClasses} ${className}
      `}
    >
      {children}
    </span>
  );
}
