interface ValueDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  color?: "green" | "amber" | "blue" | "cyan" | "purple" | "red";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  green:  { text: "text-green-DEFAULT",  bg: "bg-green-muted",  border: "border-green-DEFAULT/30" },
  amber:  { text: "text-amber-DEFAULT",  bg: "bg-amber-muted",  border: "border-amber-DEFAULT/30" },
  blue:   { text: "text-blue-DEFAULT",   bg: "bg-blue-muted",   border: "border-blue-DEFAULT/30" },
  cyan:   { text: "text-cyan-DEFAULT",   bg: "bg-cyan-muted",   border: "border-cyan-DEFAULT/30" },
  purple: { text: "text-purple-DEFAULT", bg: "bg-purple-muted", border: "border-purple-DEFAULT/30" },
  red:    { text: "text-red-DEFAULT",    bg: "bg-red-muted",    border: "border-red-DEFAULT/30" },
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
    <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${c.bg} ${c.border} min-w-[60px]`}>
      <span className={`${labelSize} font-mono text-text-muted uppercase tracking-widest mb-1`}>
        {label}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className={`${textSize} font-orbitron font-bold ${c.text} leading-none`}>
          {value}
        </span>
        {unit && (
          <span className={`text-xs font-mono ${c.text} opacity-70`}>{unit}</span>
        )}
      </div>
    </div>
  );
}
