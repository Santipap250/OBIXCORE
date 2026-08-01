import Link from "next/link";

interface ToolCardProps {
  href: string;
  title: string;
  titleTh: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: "green" | "amber" | "blue" | "cyan" | "purple" | "orange" | "pink" | "red" | "lime";
  badge?: string;
}

const accentMap = {
  green: {
    border: "border-cyan-DEFAULT/20",
    hover: "hover:border-cyan-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(34,211,238,0.10)]",
    shell: "from-cyan-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-cyan-muted/70 border-cyan-DEFAULT/35 text-cyan-DEFAULT",
    badge: "bg-cyan-muted/60 text-cyan-DEFAULT",
    glow: "from-cyan-DEFAULT/12",
  },
  amber: {
    border: "border-amber-DEFAULT/20",
    hover: "hover:border-amber-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(245,158,11,0.10)]",
    shell: "from-amber-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-amber-muted/70 border-amber-DEFAULT/35 text-amber-DEFAULT",
    badge: "bg-amber-muted/60 text-amber-DEFAULT",
    glow: "from-amber-DEFAULT/12",
  },
  blue: {
    border: "border-blue-DEFAULT/25",
    hover: "hover:border-blue-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(99,179,255,0.12)]",
    shell: "from-blue-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-blue-muted/70 border-blue-DEFAULT/35 text-blue-DEFAULT",
    badge: "bg-blue-muted/60 text-blue-DEFAULT",
    glow: "from-blue-DEFAULT/12",
  },
  cyan: {
    border: "border-cyan-DEFAULT/25",
    hover: "hover:border-cyan-DEFAULT/60 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(34,211,238,0.12)]",
    shell: "from-cyan-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-cyan-muted/70 border-cyan-DEFAULT/35 text-cyan-DEFAULT",
    badge: "bg-cyan-muted/60 text-cyan-DEFAULT",
    glow: "from-cyan-DEFAULT/12",
  },
  purple: {
    border: "border-purple-DEFAULT/22",
    hover: "hover:border-purple-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(180,145,255,0.12)]",
    shell: "from-purple-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-purple-muted/70 border-purple-DEFAULT/35 text-purple-DEFAULT",
    badge: "bg-purple-muted/60 text-purple-DEFAULT",
    glow: "from-purple-DEFAULT/12",
  },
  orange: {
    border: "border-orange-DEFAULT/20",
    hover: "hover:border-orange-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(255,159,107,0.12)]",
    shell: "from-orange-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-orange-muted/70 border-orange-DEFAULT/35 text-orange-DEFAULT",
    badge: "bg-orange-muted/60 text-orange-DEFAULT",
    glow: "from-orange-DEFAULT/12",
  },
  pink: {
    border: "border-pink-DEFAULT/20",
    hover: "hover:border-pink-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(255,95,183,0.12)]",
    shell: "from-pink-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-pink-muted/70 border-pink-DEFAULT/35 text-pink-DEFAULT",
    badge: "bg-pink-muted/60 text-pink-DEFAULT",
    glow: "from-pink-DEFAULT/12",
  },
  red: {
    border: "border-red-DEFAULT/20",
    hover: "hover:border-red-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(255,107,138,0.12)]",
    shell: "from-red-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-red-muted/70 border-red-DEFAULT/35 text-red-DEFAULT",
    badge: "bg-red-muted/60 text-red-DEFAULT",
    glow: "from-red-DEFAULT/12",
  },
  lime: {
    border: "border-lime-DEFAULT/20",
    hover: "hover:border-lime-DEFAULT/55 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(198,242,74,0.10)]",
    shell: "from-lime-DEFAULT/10 via-bg-surface/95 to-bg-surface/90",
    icon: "bg-lime-muted/70 border-lime-DEFAULT/35 text-lime-DEFAULT",
    badge: "bg-lime-muted/60 text-lime-DEFAULT",
    glow: "from-lime-DEFAULT/12",
  },
} as const;

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
      aria-label={title}
      className={`
        group relative block w-full overflow-hidden rounded-[1.75rem] border
        bg-bg-surface/90 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)]
        transition-all duration-300 active:scale-[0.99]
        ${a.border} ${a.hover}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${a.shell}`} />
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${a.glow}`} />
      <div className="absolute -left-12 top-0 h-28 w-28 rounded-full bg-cyan-DEFAULT/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-purple-DEFAULT/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border ${a.icon} shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative scale-[0.98]">{icon}</div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-orbitron text-base font-semibold tracking-wide text-text transition-colors group-hover:text-white">
              {title}
            </h3>
            {badge && (
              <span className={`hud-chip rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] ${a.badge}`}>
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 text-[13px] font-medium leading-relaxed text-cyan-100/80">
            {titleTh}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
            {description}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="hud-accent-line flex-1" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-text-faint">
              OPEN MODULE
            </span>
            <div className="hud-accent-line flex-1" />
          </div>
        </div>

        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/5 text-text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:border-cyan-DEFAULT/30 group-hover:bg-cyan-DEFAULT/10 group-hover:text-cyan-DEFAULT">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
