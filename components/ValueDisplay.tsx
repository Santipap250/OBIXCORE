interface ValueDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  color?: "green" | "amber" | "blue" | "cyan" | "purple" | "red";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  green:  { text: "text-green-DEFAULT",  bg: "bg-green-muted/60",  border: "border-green-DEFAULT/30",  glow: "shadow-[0_0_22px_rgba(0,232,122,0.18)]" },
  amber:  { text: "text-amber-DEFAULT",  bg: "bg-amber-muted/60",  border: "border-amber-DEFAULT/30",  glow: "shadow-[0_0_22px_rgba(255,187,0,0.18)]" },
  blue:   { text: "text-blue-DEFAULT",   bg: "bg-blue-muted/60",   border: "border-blue-DEFAULT/30",   glow: "shadow-[0_0_22px_rgba(0,170,255,0.18)]" },
  cyan:   { text: "text-cyan-DEFAULT",   bg: "bg-cyan-muted/60",   border: "border-cyan-DEFAULT/30",   glow: "shadow-[0_0_22px_rgba(0,216,255,0.18)]" },
  purple: { text: "text-purple-DEFAULT", bg: "bg-purple-muted/60", border: "border-purple-DEFAULT/30", glow: "shadow-[0_0_22px_rgba(176,96,255,0.18)]" },
  red:    { text: "text-red-DEFAULT",    bg: "bg-red-muted/60",    border: "border-red-DEFAULT/30",    glow: "shadow-[0_0_22px_rgba(255,64,96,0.18)]" },
};

export default function ValueDisplay({
  label,
  value,
  unit,
  color = "green",
  size = "md",
}: ValueDisplayProps) {
  const c = colorMap[color];
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const labelSize = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div className={`hud-panel group flex min-w-[72px] flex-col items-center justify-center rounded-2xl border px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] ${c.bg} ${c.border} ${c.glow}`}>
      <span className={`${labelSize} mb-1 font-mono uppercase tracking-[0.25em] text-text-muted`}>
        {label}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className={`${textSize} leading-none font-orbitron font-bold ${c.text} drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]`}>
          {value}
        </span>
        {unit && (
          <span className={`text-xs font-mono ${c.text} opacity-70`}>{unit}</span>
        )}
      </div>
    </div>
  );
}
