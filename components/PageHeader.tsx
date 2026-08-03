export type PageHeaderAccent =
  | "green" | "red" | "amber" | "blue" | "purple" | "cyan" | "pink" | "orange" | "lime";

/** Canonical glow-shadow rgb per accent — single source of truth so pages
 * can't drift out of sync the way two of them already had (a leftover
 * green value from an earlier palette iteration). Keep in sync with the
 * DEFAULT hex values in tailwind.config.ts. */
const GLOW_RGB: Record<PageHeaderAccent, string> = {
  green: "70,240,184",
  red: "255,107,138",
  amber: "255,209,102",
  blue: "99,179,255",
  purple: "180,145,255",
  cyan: "125,230,255",
  pink: "255,95,183",
  orange: "255,159,107",
  lime: "198,242,74",
};

const TEXT_CLASS: Record<PageHeaderAccent, string> = {
  green: "text-green-DEFAULT",
  red: "text-red-DEFAULT",
  amber: "text-amber-DEFAULT",
  blue: "text-blue-DEFAULT",
  purple: "text-purple-DEFAULT",
  cyan: "text-cyan-DEFAULT",
  pink: "text-pink-DEFAULT",
  orange: "text-orange-DEFAULT",
  lime: "text-lime-DEFAULT",
};

const DOT_CLASS: Record<PageHeaderAccent, string> = {
  green: "bg-green-DEFAULT",
  red: "bg-red-DEFAULT",
  amber: "bg-amber-DEFAULT",
  blue: "bg-blue-DEFAULT",
  purple: "bg-purple-DEFAULT",
  cyan: "bg-cyan-DEFAULT",
  pink: "bg-pink-DEFAULT",
  orange: "bg-orange-DEFAULT",
  lime: "bg-lime-DEFAULT",
};

/**
 * Shared page header — hud-chip badge + gradient-text h1 + subtitle.
 * Used at the top of every tool page (Wizard, Diagnose, Calculator,
 * Presets, Problems, Profiles, Blackbox, Visualizer, Tricks,
 * Compatibility) plus Support and Changelog, so the pattern only exists
 * in one place instead of 12 hand-copied instances that could each drift
 * independently (which is exactly what happened to two of them).
 */
export default function PageHeader({
  accent,
  badge,
  title,
  subtitle,
  className = "mb-6",
}: {
  accent: PageHeaderAccent;
  badge: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className={`hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] ${TEXT_CLASS[accent]}`}>
        <span
          className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[accent]}`}
          style={{ boxShadow: `0 0 10px rgba(${GLOW_RGB[accent]},0.6)` }}
        />
        {badge}
      </span>
      <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
        <span className="gradient-text">{title}</span>
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
        {subtitle}
      </p>
    </div>
  );
}
