/**
 * Shared section header — small uppercase label + gradient divider line.
 * Used to introduce a group of content on the Home dashboard (e.g. "How It
 * Works", "Core Modules"). Kept intentionally minimal: this is a label, not
 * a place for extra decoration.
 */
export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="section-title mb-3">
      <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">
        {title}
      </h2>
      <div className="section-title__line" />
    </div>
  );
}
