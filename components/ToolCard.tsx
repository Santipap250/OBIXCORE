import Link from "next/link";

interface ToolCardProps {
  href: string;
  title: string;
  titleTh: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: "green" | "amber" | "blue" | "cyan" | "purple";
  badge?: string;
}

const accentMap = {
  green:  { border: "border-green-DEFAULT/20",  hover: "hover:border-green-DEFAULT/60 hover:bg-green-muted/20",  icon: "bg-green-muted border-green-DEFAULT/40 text-green-DEFAULT",  badge: "bg-green-muted text-green-DEFAULT" },
  amber:  { border: "border-amber-DEFAULT/20",  hover: "hover:border-amber-DEFAULT/60 hover:bg-amber-muted/20",  icon: "bg-amber-muted border-amber-DEFAULT/40 text-amber-DEFAULT",  badge: "bg-amber-muted text-amber-DEFAULT" },
  blue:   { border: "border-blue-DEFAULT/20",   hover: "hover:border-blue-DEFAULT/60 hover:bg-blue-muted/20",   icon: "bg-blue-muted border-blue-DEFAULT/40 text-blue-DEFAULT",   badge: "bg-blue-muted text-blue-DEFAULT" },
  cyan:   { border: "border-cyan-DEFAULT/20",   hover: "hover:border-cyan-DEFAULT/60 hover:bg-cyan-muted/20",   icon: "bg-cyan-muted border-cyan-DEFAULT/40 text-cyan-DEFAULT",   badge: "bg-cyan-muted text-cyan-DEFAULT" },
  purple: { border: "border-purple-DEFAULT/20", hover: "hover:border-purple-DEFAULT/60 hover:bg-purple-muted/20", icon: "bg-purple-muted border-purple-DEFAULT/40 text-purple-DEFAULT", badge: "bg-purple-muted text-purple-DEFAULT" },
};

export default function ToolCard({
  href,
  title,
  titleTh,
  description,
  icon,
  accentColor = "green",
  badge,
}: ToolCardProps) {
  const a = accentMap[accentColor];

  return (
    <Link
      href={href}
      className={`
        group block p-5 rounded-xl border bg-bg-surface
        transition-all duration-200 active:scale-98
        ${a.border} ${a.hover}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center ${a.icon}`}>
          {icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-orbitron font-semibold text-sm text-text group-hover:text-inherit transition-colors">
              {title}
            </h3>
            {badge && (
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${a.badge}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-muted mt-0.5 font-sarabun leading-relaxed">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <svg
          className="flex-shrink-0 w-4 h-4 text-text-faint group-hover:text-text-muted group-hover:translate-x-0.5 transition-all mt-1"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </Link>
  );
}
